/**
 * User Model.
 * @module models/user/user
 */

import { BaseModel } from '../../helpers';
import { Role } from '../../models';

export const User = BaseModel.extend({
  tableName: 'user',
  idAttribute: 'id',
  roles() {
    return this.belongsToMany(Role, 'user_role', 'user', 'role');
  },
});
