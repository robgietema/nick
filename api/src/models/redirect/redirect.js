/**
 * Redirect Model.
 * @module models/redirect/redirect
 */

import { BookshelfModel } from '../../helpers';
import { Document } from '../../models';

export const Redirect = BookshelfModel.extend({
  tableName: 'redirect',
  idAttribute: 'uuid',
  document() {
    return this.belongsTo(Document, 'document', 'uuid');
  },
});
