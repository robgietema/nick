/**
 * RolePermission Model.
 * @module models/role-permission/role-permission
 */

import { BaseModel } from '../../helpers';
import { Role, Permission } from '../../models';

export default BaseModel.extend({
  tableName: 'role_permission',
  role() {
    return this.belongsTo(Role);
  },
  permission() {
    return this.belongsTo(Permission);
  },
});
