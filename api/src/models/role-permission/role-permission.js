/**
 * RolePermission Model.
 * @module models/role-permission/role-permission
 */

import { BookshelfModel } from '../../helpers';

export const RolePermission = BookshelfModel.extend({
  tableName: 'role_permission',
  idAttribute: 'id',
});
