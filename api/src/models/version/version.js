/**
 * Version Model.
 * @module models/version/version
 */

import { BaseModel } from '../../helpers';
import { User, Document } from '../../models';

export default BaseModel.extend({
  tableName: 'version',
  idAttribute: 'uuid',
  actor() {
    return this.belongsTo(User, 'actor', 'uuid');
  },
  document() {
    return this.belongsTo(Document, 'document', 'uuid');
  },
});
