/**
 * Role Model.
 * @module models/role/role
 */

import { uniq } from 'es-toolkit/array';

import { getRootUrl } from '../../helpers/url/url';
import { Model } from '../../models/_model/_model';
import { Permission } from '../../models/permission/permission';

/**
 * A model for Role.
 * @class Role
 * @extends Model
 */
export class Role extends Model {
  // Set relation mappings
  static get relationMappings() {
    return {
      _permissions: {
        relation: Model.ManyToManyRelation,
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
   * @method toJson
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJson(req) {
    return {
      '@id': `${getRootUrl(req)}/@roles/${this.id}`,
      '@type': 'role',
      id: this.id,
      title: req.i18n(this.title),
    };
  }

  /**
   * Fetch permissions.
   * @method fetchPermission
   * @static
   * @param {Array} roles Array of roles
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of roles.
   */
  static async fetchPermissions(roles, trx) {
    return uniq(
      (await this.relatedQuery('_permissions', trx).for(roles)).map(
        (permission) => permission.id,
      ),
    );
  }
}
