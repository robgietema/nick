/**
 * Document Model.
 * @module models/document/document
 */

import { BookshelfModel } from '../../helpers';

export const Document = BookshelfModel.extend({
  tableName: 'document',
  idAttribute: 'uuid',
});
