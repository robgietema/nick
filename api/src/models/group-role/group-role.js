/**
 * GroupRole Model.
 * @module models/group-role/group-role
 */

import { BaseModel } from '../../helpers';

export const GroupRole = BaseModel.extend({
  tableName: 'group_role',
  idAttribute: 'id',
});
