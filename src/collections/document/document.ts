/**
 * DocumentCollection.
 * @module collections/document/document
 */

import { Collection } from '../../collections/_collection/_collection';
import type { Json, Model, Request } from '../../types';

/**
 * Document Collection
 * @class DocumentCollection
 * @extends Collection
 */
export class DocumentCollection extends Collection<Model> {
  /**
   * Returns JSON data.
   * @method toJson
   * @param {Request} req Request object.
   * @returns {Promise<Json>} JSON object.
   */
  async toJson(req: Request): Promise<Json> {
    return await Promise.all(
      this.map(async (model) => await model.toJson(req)),
    );
  }
}
