/**
 * Group Role Document Repository.
 * @module repositories/user-role-document/user-role-document
 */

import { GroupRoleDocument } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Group Role Document.
 * @class GroupRoleDocumentRepository
 * @extends BaseRepository
 */
export class GroupRoleDocumentRepository extends BaseRepository {
  /**
   * Construct a GroupRoleDocumentRepository.
   * @constructs GroupRoleDocumentRepository
   */
  constructor() {
    super(GroupRoleDocument);
  }

  /**
   * Get roles.
   * @method getRoles
   * @param {Object} document Current document object.
   * @param {Array} groups Array of groups
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Array} An array of the permissions.
   */
  async getRoles(document, groups, options = {}) {
    const entries = await this.findAll(
      {
        group: ['=', groups],
        document: document.get('uuid'),
      },
      'id',
      options,
    );
    return entries.map((entry) => entry.get('role'));
  }
}

export default new GroupRoleDocumentRepository();
