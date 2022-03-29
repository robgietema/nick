/**
 * User Model.
 * @module models/group/group
 */

import { getUrl } from '../../helpers';
import { BaseModel } from '../../models';
import { UserCollection } from '../../collections';

/**
 * A model for User.
 * @class User
 * @extends BaseModel
 */
export class User extends BaseModel {
  // Set collection
  static collection = UserCollection;

  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Group } = require('../../models/group/group');
    const { Role } = require('../../models/role/role');

    return {
      roles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'user.id',
          through: {
            from: 'user_role.user',
            to: 'user_role.role',
          },
          to: 'role.id',
        },
      },
      groups: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Group,
        join: {
          from: 'user.id',
          through: {
            from: 'user_group.user',
            to: 'user_group.group',
          },
          to: 'group.id',
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
      '@id': `${getUrl(req)}/@users/${this.id}`,
      id: this.id,
      fullname: this.fullname,
      email: this.email,
      roles: this.roles ? this.roles.map((role) => role.id) : [],
      groups: this.groups ? this.groups.map((group) => group.id) : [],
    };
  }
}
