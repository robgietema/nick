/**
 * Behavior Model.
 * @module models/behavior/behavior
 */

import { mergeSchemas } from '../../helpers';
import { BehaviorCollection } from '../../collections';
import { Model } from '../../models';

/**
 * A model for Behavior.
 * @class Behavior
 * @extends Model
 */
export class Behavior extends Model {
  static collection = BehaviorCollection;

  /**
   * Fetch schema.
   * @method fetchSchema
   * @param {Object} trx Transaction object.
   * @returns {Object} Schema.
   */
  async fetchSchema(trx) {
    if (this.schema.behaviors) {
      const behaviors = await Behavior.fetchAll(
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
      return mergeSchemas(await behaviors.fetchSchema(trx), this.schema);
    }
    return this.schema;
  }
}
