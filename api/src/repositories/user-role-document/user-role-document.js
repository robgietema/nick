/**
 * User Role Document Repository.
 * @module repositories/user-role-document/user-role-document
 */

import { UserRoleDocument } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for User Role Document.
 * @class UserRoleDocumentRepository
 * @extends BaseRepository
 */
export class UserRoleDocumentRepository extends BaseRepository {
  /**
   * Construct a UserRoleDocumentRepository.
   * @constructs UserRoleDocumentRepository
   */
  constructor() {
    super(UserRoleDocument);
  }

  /**
   * Get roles.
   * @method getRoles
   * @param {Object} document Current document object.
   * @param {Object} user Current user object.
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Array} An array of the permissions.
   */
  async getRoles(document, user, options = {}) {
    const entries = await this.findAll(
      {
        document: document.get('uuid'),
        user: user.get('id'),
      },
      'id',
      options,
    );
    return entries.map((entry) => entry.get('role'));
  }
}

export default new UserRoleDocumentRepository();
