/**
 * User Role Repository.
 * @module repositories/user-role/user-role
 */

import { UserRole } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for User Role.
 * @class UserRoleRepository
 * @extends BaseRepository
 */
export class UserRoleRepository extends BaseRepository {
  /**
   * Construct a UserRoleRepository.
   * @constructs UserRoleRepository
   */
  constructor() {
    super(UserRole);
  }
}

export default new UserRoleRepository();
