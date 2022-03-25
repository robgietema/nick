/**
 * Action Model.
 * @module models/action/action
 */

import { BaseModel } from '../../helpers';

export const Action = BaseModel.extend({
  tableName: 'action',
  idAttribute: 'id',
});
