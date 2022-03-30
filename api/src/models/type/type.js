/**
 * Type Model.
 * @module models/type/type
 */

import { map, keys, compact } from 'lodash';

import { mergeSchemas } from '../../helpers';
import { TypeCollection } from '../../collections';
import { Behavior, BaseModel } from '../../models';

/**
 * A model for Type.
 * @class Type
 * @extends BaseModel
 */
export class Type extends BaseModel {
  static collection = TypeCollection;

  /**
   * Find schema.
   * @method findSchema
   * @static
   * @param {Object} trx Transaction object.
   * @returns {Object} Schema of the type.
   */
  async findSchema(trx) {
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
        trx,
      );
      return mergeSchemas(await behaviors.toJSON(), this.schema);
    }
    return this.schema;
  }

  /**
   * Get factory fields.
   * @method findFactoryFields
   * @static
   * @param {string} factory Factory field.
   * @param {Object} trx Transaction object.
   * @returns {Array} Array of fields with given factory.
   */
  async findFactoryFields(factory, trx) {
    const properties = (await this.findSchema(trx)).properties;

    // Get file fields
    const fileFields = map(keys(properties), (property) =>
      properties[property].factory === factory ? property : false,
    );
    return compact(fileFields);
  }
}
