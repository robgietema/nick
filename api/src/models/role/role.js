/**
 * Role Model.
 * @module models/role/role
 */

import { map, uniq } from 'lodash';

import { getUrl } from '../../helpers';
import { BaseModel } from '../../models';

/**
 * A model for Role.
 * @class Role
 * @extends BaseModel
 */
export class Role extends BaseModel {
  // Set relation mappings
  static get relationMappings() {
    // Prevent circular imports
    const { Permission } = require('../../models/permission/permission');

    return {
      permissions: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Permission,
        join: {
          from: 'role.id',
          through: {
            from: 'role_permission.role',
            to: 'role_permission.permission',
          },
          to: 'permission.id',
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
      '@id': `${getUrl(req)}/@roles/${this.id}`,
      '@type': 'role',
      id: this.id,
      title: req.i18n(this.title),
    };
  }

  /**
   * Find permissions.
   * @method findByRoles
   * @static
   * @param {Array} roles Array of roles
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of roles.
   */
  static async findPermissions(roles, trx) {
    return uniq(
      map(
        await this.relatedQuery('permissions', trx).for(roles),
        (permission) => permission.id,
      ),
    );
  }
}
