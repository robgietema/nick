/**
 * Group Role Repository.
 * @module repositories/group-role/group-role
 */

import { GroupRole } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Group Role.
 * @class GroupRoleRepository
 * @extends BaseRepository
 */
export class GroupRoleRepository extends BaseRepository {
  /**
   * Construct a GroupRoleRepository.
   * @constructs GroupRoleRepository
   */
  constructor() {
    super(GroupRole);
  }

  /**
   * Get roles.
   * @method getRoles
   * @param {Array} groups Array of groups
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Array} An array of the roles.
   */
  async getRoles(groups, options = {}) {
    const entries = await this.findAll(
      {
        group: ['=', groups],
      },
      'id',
      options,
    );
    return entries.map((entry) => entry.get('role'));
  }
}

export default new GroupRoleRepository();
