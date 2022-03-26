/**
 * UserRoleDocument Model.
 * @module models/user-role-document/user-role-document
 */

import { BookshelfModel } from '../../helpers';

export const UserRoleDocument = BookshelfModel.extend({
  tableName: 'user_role_document',
  idAttribute: 'id',
});
