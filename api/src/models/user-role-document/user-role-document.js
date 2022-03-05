/**
 * UserRoleDocument Model.
 * @module models/user-role-document/user-role-document
 */

import { BaseModel } from '../../helpers';
import { User, Role, Document } from '../../models';

export default BaseModel.extend({
  tableName: 'user_role_document',
  user() {
    return this.belongsTo(User);
  },
  role() {
    return this.belongsTo(Role);
  },
  document() {
    return this.belongsTo(Document);
  },
});
