/**
 * Behavior Model.
 * @module models/behavior/behavior
 */

import { BaseModel } from '../../helpers';

export const Behavior = BaseModel.extend({
  tableName: 'behavior',
  idAttribute: 'id',
});
