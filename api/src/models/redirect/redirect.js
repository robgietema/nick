/**
 * Redirect Model.
 * @module models/redirect/redirect
 */

import { BaseModel } from '../../helpers';
import { Document } from '../../models';

export const Redirect = BaseModel.extend({
  tableName: 'redirect',
  idAttribute: 'uuid',
  document() {
    return this.belongsTo(Document, 'document', 'uuid');
  },
});
