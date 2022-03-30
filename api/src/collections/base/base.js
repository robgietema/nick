/**
 * BaseCollection.
 * @module helpers/base-collection/base-collection
 */

import { map } from 'lodash';

/**
 * Base collection used to extend collections from.
 * @class BaseCollection
 */
export class BaseCollection {
  /**
   * Construct a Base Collection.
   * @constructs BaseCollection
   */
  constructor(models) {
    this.models = models;
  }

  /**
   * Maps over models.
   * @method map
   * @param {function} callback Callback function.
   * @returns {Array} Array of models.
   */
  map(callback) {
    return map(this.models, callback);
  }

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    return this.map((model) => model.toJSON(req));
  }
}
