/**
 * Document Model.
 * @module models/document/document
 */

import { BookshelfModel } from '../../helpers';
import { User } from '../../models';

export const Document = BookshelfModel.extend({
  tableName: 'document',
  idAttribute: 'uuid',
  owner() {
    return this.belongsTo(User, 'owner', 'id');
  },
});
