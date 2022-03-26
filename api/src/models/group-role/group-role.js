/**
 * GroupRole Model.
 * @module models/group-role/group-role
 */

import { BookshelfModel } from '../../helpers';

export const GroupRole = BookshelfModel.extend({
  tableName: 'group_role',
  idAttribute: 'id',
});
