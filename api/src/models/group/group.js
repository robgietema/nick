/**
 * Group Model.
 * @module models/group/group
 */

import { getUrl } from '../../helpers';
import { BaseModel } from '../../models';
import { Role } from '../../models/role/role'; // Prevent circular imports
import { GroupCollection } from '../../collections';

/**
 * A model for Group.
 * @class Group
 * @extends BaseModel
 */
export class Group extends BaseModel {
  // Set collection
  static collection = GroupCollection;

  // Set relation mappings
  static relationMappings = {
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
  };

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
}
