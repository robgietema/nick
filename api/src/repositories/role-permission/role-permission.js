/**
 * Role Permission Repository.
 * @module repositories/role-permission/role-permission
 */

import { RolePermission } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Role Permission.
 * @class RolePermissionRepository
 * @extends BaseRepository
 */
export class RolePermissionRepository extends BaseRepository {
  /**
   * Construct a RolePermissionRepository.
   * @constructs RolePermissionRepository
   */
  constructor() {
    super(RolePermission);
  }

  /**
   * Get permissions.
   * @method getPermissions
   * @param {Array} roles Array of roles
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Array} An array of the permissions.
   */
  async getPermissions(roles, options = {}) {
    const entries = await this.findAll(
      {
        role: ['=', roles],
      },
      'id',
      options,
    );
    return entries.map((entry) => entry.get('permission'));
  }
}

export default new RolePermissionRepository();
