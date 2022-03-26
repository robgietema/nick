/**
 * GroupRoleDocument Model.
 * @module models/group-role-document/group-role-document
 */

import { BookshelfModel } from '../../helpers';

export const GroupRoleDocument = BookshelfModel.extend({
  tableName: 'group_role_document',
  idAttribute: 'id',
});
