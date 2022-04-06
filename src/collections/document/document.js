/**
 * DocumentCollection.
 * @module collections/document/document
 */

import { Collection } from '../../collections';

/**
 * Document Collection
 * @class DocumentCollection
 * @extends Collection
 */
export class DocumentCollection extends Collection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  async toJSON(req) {
    return await Promise.all(
      this.map(async (model) => await model.toJSON(req)),
    );
  }
}
