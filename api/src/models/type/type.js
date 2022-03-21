/**
 * Type Model.
 * @module models/type/type
 */

import { compact, keys, map } from 'lodash';

import { BaseModel } from '../../helpers';
import { Workflow } from '../../models';

export default BaseModel.extend({
  tableName: 'type',
  idAttribute: 'id',
  workflow() {
    return this.belongsTo(Workflow, 'workflow', 'id');
  },
  getFactoryFields(factory) {
    const properties = this.get('schema').properties;

    // Get file fields
    const fileFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(fileFields);
  },
});
