/**
 * UserRole Model.
 * @module models/user-role/user-role
 */

import { BaseModel } from '../../helpers';

export default BaseModel.extend({
  tableName: 'user_role',
  idAttribute: 'id',
});
