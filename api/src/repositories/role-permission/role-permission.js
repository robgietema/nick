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
}

export default new RolePermissionRepository();
