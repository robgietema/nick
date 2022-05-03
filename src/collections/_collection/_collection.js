/**
 * Collection.
 * @module collection/_collection/_collection
 */

import { map, omitBy } from 'lodash';

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
   * Maps over models.
   * @method map
   * @param {function} callback Callback function.
   * @returns {Array} Array of models.
   */
  omitBy(callback) {
    this.models = omitBy(this.models, callback);
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

  /**
   * Returns length of the collection.
   * @method getLength
   * @returns {Number} Length of the collection.
   */
  getLength() {
    return this.models.length;
  }
}
