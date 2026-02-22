/**
 * Role Model.
 * @module models/role/role
 */

import { uniq } from 'es-toolkit/array';
import type { Knex } from 'knex';

import { getRootUrl } from '../../helpers/url/url';
import { Model } from '../../models/_model/_model';
import { Permission } from '../../models/permission/permission';
import type { Json, Request } from '../../types';

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
        relation: (Model as any).ManyToManyRelation,
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
   * @param {Request} req Request object.
   * @returns {Json} JSON object.
   */
  toJson(req: Request): Json {
    const self: any = this;
    return {
      '@id': `${getRootUrl(req)}/@roles/${self.id}`,
      '@type': 'role',
      id: self.id,
      title: req.i18n(self.title),
    } as Json;
  }

  /**
   * Fetch permissions.
   * @method fetchPermission
   * @static
   * @param {string[]} roles Array of roles
   * @param {Knex.Transaction} trx Transaction object.
   * @returns {Promise<string[]>} Array of permission ids.
   */
  static async fetchPermissions(
    roles: string[],
    trx: Knex.Transaction,
  ): Promise<string[]> {
    const permissions = await this.relatedQuery('_permissions', trx).for(roles);
    return uniq(permissions.map((permission: any) => permission.id));
  }
}
