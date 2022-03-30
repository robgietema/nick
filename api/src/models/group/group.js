/**
 * Group Model.
 * @module models/group/group
 */

import { map, uniq } from 'lodash';

import { getUrl } from '../../helpers';
import { BaseModel } from '../../models';

/**
 * A model for Group.
 * @class Group
 * @extends BaseModel
 */
export class Group extends BaseModel {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Role } = require('../../models/role/role');
    const { User } = require('../../models/user/user');

    return {
      roles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'group.id',
          through: {
            from: 'group_role.group',
            to: 'group_role.role',
          },
          to: 'role.id',
        },
      },
      users: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'group.id',
          through: {
            from: 'user_group.group',
            to: 'user_group.user',
          },
          to: 'user.id',
        },
      },
      documentRoles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'group.id',
          through: {
            from: 'group_role_document.group',
            to: 'group_role_document.role',
          },
          to: 'role.id',
        },
      },
    };
  }

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    return {
      '@id': `${getUrl(req)}/@groups/${this.id}`,
      id: this.id,
      groupname: this.id,
      title: req.i18n(this.title),
      description: req.i18n(this.description),
      email: this.email,
      roles: this.roles ? this.roles.map((role) => role.id) : [],
    };
  }

  /**
   * Find roles by document.
   * @method findRolesByDocument
   * @param {Array} groups Array of groups
   * @param {string} document Uuid of the document
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of roles.
   */
  static async findRolesByDocument(groups, document, trx) {
    return uniq(
      map(
        await this.relatedQuery('documentRoles', trx).for(groups).where({
          'group_role_document.document': document,
        }),
        (role) => role.id,
      ),
    );
  }
}
