/**
 * Document Model.
 * @module models/document/document
 */

import {
  drop,
  findIndex,
  head,
  includes,
  map,
  mapValues,
  omit,
  uniq,
} from 'lodash';

import { Model, Redirect, Role, User } from '../../models';
import { getRootUrl, ockExpired, mapSync } from '../../helpers';
import { DocumentCollection } from '../../collections';

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
   * @returns {Array} Array of roles.
   */
  async fetchVersion(version, trx) {
    this._version = await this.$relatedQuery('_versions', trx)
      .where({ version })
      .first();
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
   * Replace old path with new path
   * @method replacePath
   * @param {String} oldPath Old path.
   * @param {String} newPath New path.
   * @param {Object} trx Transaction object.
   * @returns {Promise} A Promise that resolves when replace is done.
   */
  async replacePath(oldPath, newPath, trx) {
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
    // Get file fields
    const json = this.json;

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
          download: `${this.getUrl(req)}/@@images/${json[field].uuid}.${
            json[field]['content-type'].split('/')[1]
          }`,
          filename: json[field].filename,
          size: json[field].size,
          width: json[field].width,
          height: json[field].height,
          scales: mapValues(json[field].scales, (scale) => ({
            width: scale.width,
            height: scale.height,
            download: `${this.getUrl(req)}/@@images/${scale.uuid}.${
              json[field]['content-type'].split('/')[1]
            }`,
          })),
        };
      });
    }

    // Add children if available
    if (this._children) {
      json.items = await Promise.all(
        map(this._children, async (child) => await child.toJSON(req)),
      );
    }

    // Check if version data
    const version = this._version
      ? {
          ...omit(this._version.json, ['changeNote']),
          id: this._version.id,
          modified: this._version.created,
        }
      : {};

    // Return data
    return {
      ...this.json,
      '@id': this.getUrl(req),
      '@type': this.type,
      id: this.id,
      created: this.created,
      modified: this.modified,
      UID: this.uuid,
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
      ...version,
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

      // Fetch all permissions from roles
      const permissions = await Role.fetchPermissions(extendedRoles, trx);

      // Return document and authorization data
      return {
        document: this,
        roles: extendedRoles,
        permissions,
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
        uniq([...roles, ...childRoles]),
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
}
