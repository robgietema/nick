/**
 * Document Model.
 * @module models/document/document
 */

import { BaseModel } from '../../helpers';
import { Type } from '../../models';

export default BaseModel.extend({
  tableName: 'document',
  idAttribute: 'uuid',
  parent() {
    return this.belongsTo(Document);
  },
  type() {
    return this.belongsTo(Type);
  },
});
