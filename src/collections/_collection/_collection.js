/**
 * Collection.
 * @module collection/_collection/_collection
 */

import { map } from 'lodash';

/**
 * Base collection used to extend collections from.
 * @class Collection
 */
export class Collection {
  /**
   * Construct a Collection.
   * @constructs Collection
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

  /**
   * Returns vocabulary data.
   * @method getVocabulary
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  getVocabulary(req) {
    return this.map((model) => model.getVocabulary(req));
  }
}
