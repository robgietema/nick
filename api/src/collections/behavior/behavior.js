/**
 * BehaviorCollection.
 * @module collection/behavior/behavior
 */

import { mergeSchemas, BaseCollection } from '../../helpers';

/**
 * Behavior Collection
 * @class BehaviorCollection
 * @extends BaseCollection
 */
export class BehaviorCollection extends BaseCollection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  async toJSON(req) {
    return mergeSchemas(
      ...(await Promise.all(this.map(async (model) => await model.toJSON()))),
    );
  }
}
