/**
 * Group Model.
 * @module models/group/group
 */

import { BaseModel } from '../../helpers';
import { Role } from '../../models';

export const Group = BaseModel.extend({
  tableName: 'group',
  idAttribute: 'id',
  roles() {
    return this.belongsToMany(Role, 'group_role', 'group', 'role');
  },
});
