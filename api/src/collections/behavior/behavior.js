/**
 * BehaviorCollection.
 * @module collection/behavior/behavior
 */

import { mergeSchemas } from '../../helpers';
import { Collection } from '../../collections';

/**
 * Behavior Collection
 * @class BehaviorCollection
 * @extends Collection
 */
export class BehaviorCollection extends Collection {
  /**
   * Fetch schema.
   * @method fetchSchema
   * @param {Object} trx Transaction object.
   * @returns {Object} Schema.
   */
  async fetchSchema(trx) {
    return mergeSchemas(
      ...(await Promise.all(
        this.map(async (model) => await model.fetchSchema(trx)),
      )),
    );
  }
}
