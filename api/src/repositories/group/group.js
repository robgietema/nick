/**
 * Group Repository.
 * @module repositories/group/group
 */

import { Group } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Group.
 * @class GroupRepository
 * @extends BaseRepository
 */
export class GroupRepository extends BaseRepository {
  /**
   * Construct a GroupRepository for Group.
   * @constructs GroupRepository
   */
  constructor() {
    super(Group);
  }
}

export default new GroupRepository();
