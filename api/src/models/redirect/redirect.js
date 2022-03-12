/**
 * Redirect Model.
 * @module models/redirect/redirect
 */

import { BaseModel } from '../../helpers';

export default BaseModel.extend({
  tableName: 'redirect',
  idAttribute: 'uuid',
});
