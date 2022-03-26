/**
 * Version Model.
 * @module models/version/version
 */

import { BookshelfModel } from '../../helpers';
import { User } from '../../models';

export const Version = BookshelfModel.extend({
  tableName: 'version',
  idAttribute: 'uuid',
  actor() {
    return this.belongsTo(User, 'actor', 'id');
  },
});
