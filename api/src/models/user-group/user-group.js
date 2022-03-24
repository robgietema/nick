/**
 * UserGroup Model.
 * @module models/user-group/user-group
 */

import { BaseModel } from '../../helpers';

export const UserGroup = BaseModel.extend({
  tableName: 'user_group',
  idAttribute: 'id',
});
