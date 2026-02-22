/**
 * Permission Model.
 * @module models/permission/permission
 */

import { Model } from '../../models/_model/_model';

import { Role } from '../../models/role/role';

/**
 * A model for Permission.
 * @class Permission
 * @extends Model
 */
export class Permission extends Model {
  // Set relation mappings
  static get relationMappings() {
    return {
      _roles: {
        relation: (Model as any).ManyToManyRelation,
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
