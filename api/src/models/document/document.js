/**
 * Document Model.
 * @module models/document/document
 */

import { BaseModel } from '../../helpers';
import { User } from '../../models';

export const Document = BaseModel.extend({
  tableName: 'document',
  idAttribute: 'uuid',
  owner() {
    return this.belongsTo(User, 'owner', 'id');
  },
});
