/**
 * Behavior Model.
 * @module models/behavior/behavior
 */

import { mergeSchemas, BaseModel } from '../../helpers';
import { BehaviorCollection } from '../../collections';

/**
 * A model for Behavior.
 * @class Behavior
 * @extends BaseModel
 */
export class Behavior extends BaseModel {
  static collection = BehaviorCollection;

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  async toJSON() {
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
}
