/**
 * Group Model.
 * @module models/group/group
 */

import { BaseModel } from '../../helpers';
import { Role } from '../../models';

export default BaseModel.extend({
  tableName: 'group',
  idAttribute: 'uuid',
  roles() {
    return this.belongsToMany(Role, 'group_role', 'group', 'role');
  },
});
