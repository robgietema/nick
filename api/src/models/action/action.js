/**
 * Action Model.
 * @module models/action/action
 */

import { BookshelfModel } from '../../helpers';

export const Action = BookshelfModel.extend({
  tableName: 'action',
  idAttribute: 'id',
});
