/**
 * User Group Repository.
 * @module repositories/user-group/user-group
 */

import { UserGroup } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for User Group.
 * @class UserGroupRepository
 * @extends BaseRepository
 */
export class UserGroupRepository extends BaseRepository {
  /**
   * Construct a UserGroupRepository.
   * @constructs UserGroupRepository
   */
  constructor() {
    super(UserGroup);
  }

  /**
   * Get groups
   * @method getGroups
   * @param {Object} user User object
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise} A Promise that resolves to an array of groups.
   */
  async getGroups(user, options = {}) {
    const groupObjects = await this.findAll(
      {
        user: user.get('uuid'),
      },
      'id',
      options,
    );
    return groupObjects.map((entry) => entry.get('group'));
  }
}

export default new UserGroupRepository();
