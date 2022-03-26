/**
 * Permission Model.
 * @module models/permission/permission
 */

import { BookshelfModel } from '../../helpers';

export const Permission = BookshelfModel.extend({
  tableName: 'permission',
  idAttribute: 'id',
});
