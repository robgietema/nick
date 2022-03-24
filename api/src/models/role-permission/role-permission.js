/**
 * RolePermission Model.
 * @module models/role-permission/role-permission
 */

import { BaseModel } from '../../helpers';

export const RolePermission = BaseModel.extend({
  tableName: 'role_permission',
  idAttribute: 'id',
});
