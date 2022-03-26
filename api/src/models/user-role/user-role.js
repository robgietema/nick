/**
 * UserRole Model.
 * @module models/user-role/user-role
 */

import { BookshelfModel } from '../../helpers';

export const UserRole = BookshelfModel.extend({
  tableName: 'user_role',
  idAttribute: 'id',
});
