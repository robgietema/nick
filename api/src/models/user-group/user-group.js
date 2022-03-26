/**
 * UserGroup Model.
 * @module models/user-group/user-group
 */

import { BookshelfModel } from '../../helpers';

export const UserGroup = BookshelfModel.extend({
  tableName: 'user_group',
  idAttribute: 'id',
});
