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
}

export default new UserRoleDocumentRepository();
