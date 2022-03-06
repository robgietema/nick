/**
 * Type Model.
 * @module models/type/type
 */

import { BaseModel } from '../../helpers';
import { Workflow } from '../../models';

export default BaseModel.extend({
  tableName: 'type',
  idAttribute: 'id',
  workflow() {
    return this.belongsTo(Workflow, 'workflow', 'id');
  },
});
