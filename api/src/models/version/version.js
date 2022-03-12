/**
 * Version Model.
 * @module models/version/version
 */

import { BaseModel } from '../../helpers';
import { User } from '../../models';

export default BaseModel.extend({
  tableName: 'version',
  idAttribute: 'uuid',
  actor() {
    return this.belongsTo(User, 'actor', 'uuid');
  },
});
