/**
 * Collection.
 * @module collection/_collection/_collection
 */

import { map, omitBy } from 'lodash';
import { Request } from 'express';

interface Model {
  toJSON: (req: Request) => any;
  getVocabulary: (req: Request) => any;
}

/**
 * Base collection used to extend collections from.
 * @class Collection
 */
export class Collection<T extends Model> {
  protected models: T[];

  /**
   * Construct a Collection.
   * @constructs Collection
   */
  constructor(models: T[]) {
    this.models = models;
  }

  /**
   * Maps over models.
   * @method map
   * @param {function} callback Callback function.
   * @returns {Array} Array of models.
   */
  map<U>(callback: (model: T) => U): U[] {
    return map(this.models, callback);
  }

  /**
   * Maps over models.
   * @method omitBy
   * @param {function} callback Callback function.
   */
  omitBy(callback: (model: T) => boolean): void {
    this.models = omitBy(this.models, callback) as T[];
  }

  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Request} req Request object.
   * @returns {Array} JSON object.
   */
  toJSON(req: Request): any[] {
    return this.map((model) => model.toJSON(req));
  }

  /**
   * Returns vocabulary data.
   * @method getVocabulary
   * @param {Request} req Request object.
   * @returns {Object} JSON object.
   */
  getVocabulary(req: Request): any[] {
    return this.map((model) => model.getVocabulary(req));
  }

  /**
   * Returns length of the collection.
   * @method getLength
   * @returns {Number} Length of the collection.
   */
  getLength(): number {
    return this.models.length;
  }
}