/**
 * Group Model.
 * @module models/group/group
 */

import { BookshelfModel } from '../../helpers';
import { Role } from '../../models';

export const Group = BookshelfModel.extend({
  tableName: 'group',
  idAttribute: 'id',
  roles() {
    return this.belongsToMany(Role, 'group_role', 'group', 'role');
  },
});
