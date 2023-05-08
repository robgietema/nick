/**
 * Document Model.
 * @module models/document/document
 */

import _, {
  compact,
  concat,
  drop,
  findIndex,
  head,
  includes,
  isArray,
  isFunction,
  isUndefined,
  keys,
  last,
  map,
  mapValues,
  omit,
  omitBy,
  uniq,
  values,
} from 'lodash';
import { v4 as uuid } from 'uuid';

import { Catalog, Model, Permission, Redirect, Role, User } from '../../models';
import {
  formatSize,
  getRootUrl,
  lockExpired,
  log,
  mapAsync,
  mapSync,
  copyFile,
  isPromise,
  uniqueId,
} from '../../helpers';
import { DocumentCollection } from '../../collections';

import profile from '../../profiles/core/catalog';

const { config } = require(`${process.cwd()}/config`);

/**
 * A model for Document.
 * @class Document
 * @extends Model
 */
export class Document extends Model {
  static collection = DocumentCollection;

  static idColumn = 'uuid';

  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Type } = require('../../models/type/type');
    const { User } = require('../../models/user/user');
    const { Version } = require('../../models/version/version');

    return {
      _owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'document.owner',
          to: 'user.id',
        },
      },
      _parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Document,
        join: {
          from: 'document.parent',
          to: 'document.uuid',
        },
      },
      _children: {
        relation: Model.HasManyRelation,
        modelClass: Document,
        join: {
          from: 'document.uuid',
          to: 'document.parent',
        },
      },
      _catalog: {
        relation: Model.BelongsToOneRelation,
        modelClass: Catalog,
        join: {
          from: 'document.uuid',
          to: 'catalog.document',
        },
      },
      _versions: {
        relation: Model.HasManyRelation,
        modelClass: Version,
        join: {
          from: 'document.uuid',
          to: 'version.document',
        },
      },
      _type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Type,
        join: {
          from: 'document.type',
          to: 'type.id',
        },
      },
      _userRoles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'document.uuid',
          through: {
            from: 'user_role_document.document',
            to: 'user_role_document.role',
            extra: ['user'],
          },
          to: 'role.id',
        },
      },
      _groupRoles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'document.uuid',
          through: {
            from: 'group_role_document.document',
            to: 'group_role_document.role',
            extra: ['group'],
          },
          to: 'role.id',
        },
      },
    };
  }

  // Modifiers
  static modifiers = {
    order(query) {
      query.orderBy('position_in_parent');
    },
  };

  /**
   * Fetch version
   * @method fetchVersion
   * @param {string} document Uuid of the document
   * @param {Object} trx Transaction object.
   */
  async fetchVersion(version, trx) {
    this._version = await this.$relatedQuery('_versions', trx)
      .where({ version })
      .first();
  }

  /**
   * Fetch relation lists
   * @method fetchRelationLists
   * @param {Object} trx Transaction object.
   */
  async fetchRelationLists(trx) {
    // Check if version data
    const version = this._version
      ? {
          ...this._version.json,
        }
      : {};

    // Get file fields
    const json = {
      ...this.json,
      ...version,
    };

    // Reset lists
    this._relationLists = {};

    // Loop through relation list fields
    const relationListFields = this._type.getFactoryFields('Relation List');
    await Promise.all(
      relationListFields.map(async (field) => {
        // Check if related documents
        if (isArray(json[field]) && json[field].length > 0) {
          this._relationLists[field] = await Document.fetchAll(
            {
              uuid: ['=', json[field]],
            },
            {},
            trx,
          );
        }
      }),
    );
  }

  /**
   * Get url
   * @method getUrl
   * @param {Object} req Request object
   * @returns {string} Url
   */
  getUrl(req) {
    return `${getRootUrl(req)}${this.path === '/' ? '' : this.path}`;
  }

  /**
   * Set id
   * @method setId
   * @param {string} id Provided id (can be empty)
   * @param {Array} blacklist Blacklist ids
   * @returns {string} Id
   */
  setId(id, blacklist) {
    this.id = uniqueId(id, blacklist);
  }

  /**
   * Get title
   * @method getTitle
   * @returns {string} Title
   */
  getTitle() {
    return this.json.title;
  }

  /**
   * Replace old path with new path
   * @method replacePath
   * @static
   * @param {String} oldPath Old path.
   * @param {String} newPath New path.
   * @param {Object} trx Transaction object.
   * @returns {Promise} A Promise that resolves when replace is done.
   */
  static async replacePath(oldPath, newPath, trx) {
    const documents = await this.fetchAll(
      { path: ['~', `^${oldPath}`] },
      {},
      trx,
    );
    await Promise.all(
      documents.map(async (document) => {
        await Redirect.create(
          {
            document: document.uuid,
            path: document.path,
          },
          {},
          trx,
        );
      }),
    );
    const knex = Document.knex();
    await knex
      .raw(
        `update document set path = regexp_replace(path, '^${oldPath}/(.*)$', '${newPath}/\\1', 'g') where path ~ '^${oldPath}/.*$'`,
      )
      .transacting(trx);
    await knex
      .raw(
        `update catalog set _path = regexp_replace(_path, '^${oldPath}/(.*)$', '${newPath}/\\1', 'g') where _path ~ '^${oldPath}/.*$'`,
      )
      .transacting(trx);
  }

  /**
   * Reorder
   * @method reorder
   * @param {string} id Id of item to order.
   * @param {number|string} delta 'top', 'bottom' or numerical offset.
   * @param {Object} trx Transaction object.
   * @returns {Promise} A Promise that resolves when the ordering has been done.
   */
  async reorder(id, delta, trx) {
    let to;
    const from = findIndex(this._children, { id });

    // Set to based on delta
    if (delta === 'top') {
      to = 0;
    } else if (delta === 'bottom') {
      to = this._children.length - 1;
    } else {
      to = from + delta;
    }

    // Reorder and save to db
    this._children.splice(to, 0, this._children.splice(from, 1)[0]);
    await this.fixOrder();
  }

  /**
   * Fix order
   * @method fixOrder
   * @param {Object} trx Transaction object.
   * @returns {Promise} A Promise that resolves when the ordering has been done.
   */
  async fixOrder(trx) {
    return await Promise.all(
      this._children.map(
        async (child, index) =>
          await child.update({ position_in_parent: index }, trx),
      ),
    );
  }

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  async toJSON(req) {
    // Check if version data
    const version = this._version
      ? {
          ...omit(this._version.json, ['changeNote']),
          id: this._version.id,
          modified: this._version.created,
        }
      : {};

    // Get file fields
    const json = {
      ...this.json,
      ...version,
    };

    // Check if type available
    if (this._type) {
      // Loop through file fields
      const fileFields = this._type.getFactoryFields('File');
      mapSync(fileFields, (field) => {
        // Set data
        json[field] = {
          'content-type': json[field]['content-type'],
          download: `${this.getUrl(req)}/@@download/file`,
          filename: json[field].filename,
          size: json[field].size,
        };
      });

      // Loop through image fields
      const imageFields = this._type.getFactoryFields('Image');
      mapSync(imageFields, (field) => {
        // Set data
        json[field] = {
          'content-type': json[field]['content-type'],
          download: `${this.getUrl(req)}/@@images/${json[field].uuid}.${last(
            json[field].filename.split('.'),
          )}`,
          filename: json[field].filename,
          size: json[field].size,
          width: json[field].width,
          height: json[field].height,
          scales: mapValues(json[field].scales, (scale) => ({
            width: scale.width,
            height: scale.height,
            download: `${this.getUrl(req)}/@@images/${scale.uuid}.${last(
              json[field].filename.split('.'),
            )}`,
          })),
        };
      });

      // Loop through relation list fields
      const relationListFields = this._type.getFactoryFields('Relation List');
      mapSync(relationListFields, async (field) => {
        // Check if related documents
        if (isArray(json[field]) && json[field].length > 0) {
          json[field] = this._relationLists[field].map((document) => ({
            '@id': document.path,
            UID: document.uuid,
            title: document.json.title,
            description: document.json.description,
            review_state: document.workflow_state,
          }));
        }
      });
    }

    // Add children if available
    if (this._children) {
      json.items = await Promise.all(
        map(this._children, async (child) => await child.toJSON(req)),
      );
    }

    // Return data
    return {
      ...json,
      '@id': this.getUrl(req),
      '@type': this.type,
      id: this.id,
      title: this.getTitle(),
      created: this.created,
      modified: this.modified,
      UID: this.uuid,
      owner: this.owner,
      is_folderish: this._type
        ? includes(this._type._schema.behaviors, 'folderish')
        : true,
      review_state: this.workflow_state,
      lock:
        this.lock.locked && lockExpired(this)
          ? {
              locked: false,
              stealable: true,
            }
          : this.lock,
    };
  }

  /**
   * Traverse path.
   * @method traverse
   * @param {Array} slugs Array of slugs.
   * @param {Object} user Current user object.
   * @param {Array} roles Array of roles.
   * @param {Object} trx Transaction object.
   * @returns {Promise<Object>} A Promise that resolves to an object.
   */
  async traverse(slugs, user, roles, trx) {
    // Check if at leaf node
    if (slugs.length === 0) {
      // Add owner to roles if current document owned by user
      const extendedRoles = uniq([
        ...roles,
        ...(user.id === this.owner ? ['Owner'] : []),
      ]);

      // Return document and authorization data
      return {
        document: this,
        localRoles: extendedRoles,
      };
    } else {
      // Fetch child matching the id
      const child = await Document.fetchOne(
        {
          parent: this.uuid,
          id: head(slugs),
        },
        {},
        trx,
      );

      // Check if child not found
      if (!child) {
        return false;
      }

      // Fetch roles based on user and group from child
      const childRoles = await user.fetchUserGroupRolesByDocument(
        child.uuid,
        trx,
      );

      // Recursively call the traverse on child
      return child.traverse(
        drop(slugs),
        user,
        child.inherit_roles ? uniq([...roles, ...childRoles]) : childRoles,
        trx,
      );
    }
  }

  /**
   * Fetch workflow history
   * @method fetchWorkflowHistory
   * @param {Object} req Request object.
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of workflow history.
   */
  async fetchWorkflowHistory(req, trx) {
    return await Promise.all(
      map(this.workflow_history, async (item) => {
        const user = await User.fetchById(item.actor);
        return {
          ...item,
          actor: {
            '@id': `${getRootUrl(req)}/@users/${user.id}`,
            fullname: user.fullname,
            id: user.id,
            username: user.id,
          },
          comments: '',
          type: 'workflow',
        };
      }),
    );
  }

  /**
   * Copy object
   * @method copy
   * @param {string} parent Parent to copy to.
   * @param {string} path New path.
   * @param {string} id New id.
   * @param {Object} trx Transaction object.
   */
  async copy(parent, path, id, trx) {
    // Get json
    let json = this.json;

    // Get type information
    await this.fetchRelated('_type', trx);

    // Store used uuids
    let fileUuid = {};
    const fileFields = this._type.getFactoryFields('File');
    const imageFields = this._type.getFactoryFields('Image');

    // Copy files
    const copyFiles = () =>
      map(fileFields, (field) => {
        if (json[field].uuid in fileUuid) {
          json[field].uuid = fileUuid[json[field].uuid];
        } else {
          const newUuid = uuid();
          copyFile(json[field].uuid, newUuid);
          fileUuid[json[field].uuid] = newUuid;
          json[field].uuid = newUuid;
        }
      });
    copyFiles();

    // Copy images
    const copyImages = () =>
      map(imageFields, (field) => {
        if (json[field].uuid in fileUuid) {
          json[field].uuid = fileUuid[json[field].uuid];
        } else {
          const newUuid = uuid();
          copyFile(json[field].uuid, newUuid);
          fileUuid[json[field].uuid] = newUuid;
          json[field].uuid = newUuid;
        }
        map(keys(config.imageScales), (scale) => {
          if (json[field].scales[scale].uuid in fileUuid) {
            json[field].scales[scale].uuid =
              fileUuid[json[field].scales[scale].uuid];
          } else {
            const newScaleUuid = uuid();
            copyFile(this.json[field].scales[scale].uuid, newScaleUuid);
            fileUuid[json[field].scales[scale].uuid] = newScaleUuid;
            json[field].scales[scale].uuid = newScaleUuid;
          }
        });
      });
    copyImages();

    // Copy document
    const document = await Document.create(
      {
        ...omit(this, ['_type']),
        json,
        parent,
        path,
        id,
        uuid: uuid(),
        workflow_history: JSON.stringify(this.workflow_history),
      },
      {},
      trx,
    );

    // Index document
    document.index(trx);

    // Copy versions
    await this.fetchRelated('_versions', trx);
    await Promise.all(
      this._versions.map(async (version) => {
        // Get current json
        json = version.json;

        // Copy images/files
        copyFiles();
        copyImages();

        // Copy version
        await document.createRelated(
          '_versions',
          {
            ...version,
            json,
          },
          trx,
        );
      }),
    );

    // Copy user roles
    await this.fetchRelated('_userRoles', trx);
    await Promise.all(
      this._userRoles.map(async (userRole) => {
        await document
          .$relatedQuery('_userRoles', trx)
          .relate({ id: userRole.id, user: userRole.user });
      }),
    );

    // Copy group roles
    await this.fetchRelated('_groupRoles', trx);
    await Promise.all(
      this._groupRoles.map(async (groupRole) => {
        await document
          .$relatedQuery('_groupRoles', trx)
          .relate({ id: groupRole.id, group: groupRole.group });
      }),
    );

    // Copy children
    await this.fetchRelated('_children', trx);
    await Promise.all(
      this._children.map(async (child) => {
        await child.copy(document.uuid, `${path}/${child.id}`, child.id, trx);
      }),
    );
  }

  /**
   * Is folderish
   * @method isFolderish
   * @return {boolean} True if folderish
   */
  isFolderish() {
    return includes(this._type._schema.behaviors, 'folderish');
  }

  /**
   * Searchable text
   * @method searchableText
   * @return {string} Searchable text
   */
  searchableText() {
    return compact([this.json.title, this.json.description]).join(' ');
  }

  /**
   * Get object size
   * @method getObjSize
   * @return {number} Object size
   */
  getObjSize() {
    return JSON.stringify(this.json).length;
  }

  /**
   * Get mime type
   * @method mimeType
   * @return {string} Mime type of the object
   */
  mimeType() {
    const imageFields = this._type.getFactoryFields('Image');
    if (imageFields.length > 0) {
      return this.json[imageFields[0]]['content-type'];
    }
    const fileFields = this._type.getFactoryFields('File');
    if (fileFields.length > 0) {
      return this.json[fileFields[0]]['content-type'];
    }
    return undefined;
  }

  /**
   * List of creators
   * @method listCreators
   * @return {Array} List of creators
   */
  listCreators() {
    return [this.owner];
  }

  /**
   * List of allowed users, groups and roles
   * @method allowedUsersGroupsRoles
   * @param {Object} trx Transaction object.
   * @return {Array} List of allowed users, groups and roles
   */
  async allowedUsersGroupsRoles(trx) {
    // Get global roles
    const view = await Permission.fetchById('View');
    await view.fetchRelated('_roles', trx);
    const globalRoles = view._roles.map((role) => role.id);

    // Get workflow roles
    const workflowRoles = _(
      this._type._workflow.json.states[this.workflow_state].permissions,
    )
      .pickBy((value) => includes(value, 'View'))
      .keys()
      .value();

    // Get users and groups from local roles with 'View' permission
    const localUsersGroups = await this.fetchLocalUsersGroups(globalRoles, trx);

    // Return allowed
    return uniq(concat(globalRoles, workflowRoles, localUsersGroups));
  }

  /**
   * Re index children
   * @method reindexChildren
   * @param {Array} viewRoles List of roles with the view permission.
   * @param {Object} trx Transaction object.
   * @return {Array} List of allowed users and groups.
   */
  async fetchLocalUsersGroups(viewRoles, trx) {
    let localUsersGroups = [];

    // Fetch local user and group roles
    await this.fetchRelated('[_userRoles, _groupRoles]', trx);

    // Append user roles
    this._userRoles.map((role) => {
      if (includes(viewRoles, role.id)) {
        localUsersGroups.push(role.user);
      }
    });

    // Append group roles
    this._groupRoles.map((role) => {
      if (includes(viewRoles, role.id)) {
        localUsersGroups.push(role.group);
      }
    });

    // Check if we should traverse up
    if (this.parent && this.inherit_roles) {
      // Fetch parent
      await this.fetchRelated('_parent', trx);

      // Append parent users and groups
      localUsersGroups = concat(
        localUsersGroups,
        await this._parent.fetchLocalUsersGroups(viewRoles, trx),
      );
    }
    return uniq(localUsersGroups);
  }

  /**
   * Re index children
   * @method reindexChildren
   * @param {Object} trx Transaction object.
   */
  async reindexChildren(trx) {
    return Promise.all(
      map(this._children, async (child) => await child.index(trx, false)),
    );
  }

  /**
   * Index children
   * @method indexChildren
   * @param {Object} trx Transaction object.
   */
  async indexChildren(trx) {
    return Promise.all(
      map(this._children, async (child) => await child.index(trx)),
    );
  }

  /**
   * Re index object
   * @method reindex
   * @param {Object} trx Transaction object.
   */
  async reindex(trx) {
    return this.index(trx, false);
  }

  /**
   * Index object
   * @method index
   * @param {Object} trx Transaction object.
   * @param {boolean} insert Insert or update.
   */
  async index(trx, insert = true) {
    let fields = {};

    // If type not found fetch type
    if (!this._type) {
      await this.fetchRelated('_type', trx);
    }

    // If workflow not found fetch workflow
    if (!this._type._workflow) {
      await this._type.fetchRelated('_workflow', trx);
    }

    // Loop indexes
    await Promise.all(
      map(profile.indexes, async (index) => {
        if (index.attr in this) {
          fields[`_${index.name}`] = { type: index.type };
          if (isFunction(this[index.attr])) {
            const value = this[index.attr](trx);
            fields[`_${index.name}`].value = isPromise(value)
              ? await value
              : value;
          } else {
            fields[`_${index.name}`].value = this[index.attr];
          }
        } else if (index.attr in this._type._schema.properties) {
          fields[`_${index.name}`] = {
            type: index.type,
            value: this.json[index.attr],
          };
        }
      }),
    );

    // Loop metadata
    await Promise.all(
      map(profile.metadata, async (metadata) => {
        if (metadata.attr in this) {
          fields[metadata.name] =
            typeof this[metadata.attr] === 'function'
              ? { type: metadata.type, value: this[metadata.attr]() }
              : { type: metadata.type, value: this[metadata.attr] };
        } else if (metadata.attr in this._type._schema.properties) {
          fields[metadata.name] = {
            type: metadata.type,
            value: this.json[metadata.attr],
          };
        }
      }),
    );

    // Get knex
    const knex = Document.knex();

    // Remove undefined
    fields = omitBy(fields, (field) => isUndefined(field.value));

    // Create catalog entry
    if (insert) {
      // Add document
      fields['document'] = { type: 'uuid', value: this.uuid };

      // Insert into catalog
      await knex
        .raw(
          `INSERT INTO catalog ("${keys(fields).join('", "')}") VALUES (${map(
            keys(fields),
            (field) => (fields[field].type === 'text' ? 'to_tsvector(?)' : '?'),
          ).join(', ')});`,
          map(values(fields), (field) => field.value),
        )
        .transacting(trx);
    } else {
      // Insert into catalog
      await knex
        .raw(
          `UPDATE catalog SET ${map(
            keys(fields),
            (key) =>
              `"${key}" = ${
                fields[key].type === 'text' ? 'to_tsvector(?)' : '?'
              }`,
          ).join(', ')} WHERE document = '${this.uuid}';`,
          map(values(fields), (field) => field.value),
        )
        .transacting(trx);
    }
  }
}
