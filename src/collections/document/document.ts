/**
 * DocumentCollection.
 * @module collections/document/document
 */

import { Collection } from '../../collections';
import type { Json, Model, Request } from '../../types';

/**
 * Document Collection
 * @class DocumentCollection
 * @extends Collection
 */
export class DocumentCollection extends Collection<Model> {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Request} req Request object.
   * @returns {Promise<Json>} JSON object.
   */
  async toJSON(req: Request): Promise<Json> {
    return await Promise.all(
      this.map(async (model) => await model.toJSON(req)),
    );
  }
}