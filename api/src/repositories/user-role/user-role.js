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

  /**
   * Get roles.
   * @method getRoles
   * @param {Object} user Current user object.
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Array} An array of the permissions.
   */
  async getRoles(user, options = {}) {
    const entries = await this.findAll(
      {
        user: user.get('id'),
      },
      'id',
      options,
    );
    return entries.map((entry) => entry.get('role'));
  }
}

export default new UserRoleRepository();
