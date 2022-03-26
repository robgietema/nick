/**
 * User Model.
 * @module models/user/user
 */

import { BookshelfModel } from '../../helpers';
import { Role } from '../../models';

export const User = BookshelfModel.extend({
  tableName: 'user',
  idAttribute: 'id',
  roles() {
    return this.belongsToMany(Role, 'user_role', 'user', 'role');
  },
});
