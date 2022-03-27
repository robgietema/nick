/**
 * Type Model.
 * @module models/type/type
 */

import { map, keys, compact } from 'lodash';

import { mergeSchemas, BaseModel } from '../../helpers';
import { TypeCollection } from '../../collections';
import { Behavior } from '../../models';

/**
 * A model for Type.
 * @class Type
 * @extends BaseModel
 */
export class Type extends BaseModel {
  static collection = TypeCollection;
  async getSchema() {
    if (this.schema.behaviors) {
      const behaviors = await Behavior.findAll(
        {
          id: ['=', this.schema.behaviors],
        },
        {
          order: {
            column: 'id',
            values: this.schema.behaviors,
          },
        },
      );
      return mergeSchemas(await behaviors.toJSON(), this.schema);
    }
    return this.schema;
  }
  async getFactoryFields(factory) {
    const properties = (await this.getSchema()).properties;

    // Get file fields
    const fileFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(fileFields);
  }
}
