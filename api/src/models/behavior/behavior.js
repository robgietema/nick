/**
 * Behavior Model.
 * @module models/behavior/behavior
 */

import { BookshelfModel } from '../../helpers';

export const Behavior = BookshelfModel.extend({
  tableName: 'behavior',
  idAttribute: 'id',
});
