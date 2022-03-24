/**
 * UserRole Model.
 * @module models/user-role/user-role
 */

import { BaseModel } from '../../helpers';

export const UserRole = BaseModel.extend({
  tableName: 'user_role',
  idAttribute: 'id',
});
