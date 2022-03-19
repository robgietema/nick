/**
 * UserGroup Model.
 * @module models/user-group/user-group
 */

import { BaseModel } from '../../helpers';

export default BaseModel.extend({
  tableName: 'user_group',
  idAttribute: 'id',
});
