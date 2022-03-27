/**
 * Role Model.
 * @module models/role/role
 */

import { BookshelfModel } from '../../helpers';

export const Role = BookshelfModel.extend({
  tableName: 'role',
  idAttribute: 'id',
});
