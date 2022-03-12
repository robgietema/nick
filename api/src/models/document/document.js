/**
 * Document Model.
 * @module models/document/document
 */

import { BaseModel } from '../../helpers';
import { Type, User } from '../../models';

export default BaseModel.extend({
  tableName: 'document',
  idAttribute: 'uuid',
  parent() {
    return this.belongsTo(Document);
  },
  type() {
    return this.belongsTo(Type);
  },
  owner() {
    return this.belongsTo(User, 'owner', 'uuid');
  },
});
