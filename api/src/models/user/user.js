/**
 * User Model.
 * @module models/user/user
 */

import { BaseModel } from '../../helpers';
import { Role } from '../../models';

export default BaseModel.extend({
  tableName: 'user',
  idAttribute: 'uuid',
  roles() {
    return this.belongsToMany(Role, 'user_role', 'user', 'role');
  },
});
