/**
 * User Model.
 * @module models/user/user
 */

import { BookshelfModel } from '../../helpers';

export const User = BookshelfModel.extend({
  tableName: 'user',
  idAttribute: 'id',
});
