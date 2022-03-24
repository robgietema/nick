/**
 * UserRoleDocument Model.
 * @module models/user-role-document/user-role-document
 */

import { BaseModel } from '../../helpers';

export const UserRoleDocument = BaseModel.extend({
  tableName: 'user_role_document',
  idAttribute: 'id',
});
