/**
 * Permission Model.
 * @module models/permission/permission
 */

import { BaseModel } from '../../helpers';

export const Permission = BaseModel.extend({
  tableName: 'permission',
  idAttribute: 'id',
});
