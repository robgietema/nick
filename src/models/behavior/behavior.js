/**
 * Behavior Model.
 * @module models/behavior/behavior
 */

import { mergeSchemas } from '../../helpers/schema/schema';
import { BehaviorCollection } from '../../collections/behavior/behavior';
import { Model } from '../../models/_model/_model';

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
        trx,
      );
      return mergeSchemas(
        {
          name: 'behaviors',
          data: await behaviors.fetchSchema(trx),
        },
        {
          name: this.id,
          data: this.schema,
        },
      );
    }
    return this.schema;
  }
}
