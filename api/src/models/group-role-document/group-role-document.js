/**
 * GroupRoleDocument Model.
 * @module models/group-role-document/group-role-document
 */

import { BaseModel } from '../../helpers';

export const GroupRoleDocument = BaseModel.extend({
  tableName: 'group_role_document',
  idAttribute: 'id',
});
