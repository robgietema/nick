/**
 * Permission Model.
 * @module models/permission/permission
 */

import { Model } from '../../models';

/**
 * A model for Permission.
 * @class Permission
 * @extends Model
 */
export class Permission extends Model {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Role } = require('../../models/role/role');

    return {
      _roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'permission.id',
          through: {
            from: 'role_permission.permission',
            to: 'role_permission.role',
          },
          to: 'role.id',
        },
      },
    };
  }
}
