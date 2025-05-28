/**
 * IndexCollection.
 * @module collection/index/index
 */

import { Collection } from '../../collections';
import type { Json, Model, Request } from '../../types';

interface IndexModel extends Model {
  name: string;
}

/**
 * Index Collection
 * @class IndexCollection
 * @extends Collection
 */
export class IndexCollection extends Collection<IndexModel> {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Request} req Request object.
   * @returns {Promise<any[]>} JSON object.
   */
  async toJSON(req: Request): Promise<Json> {
    let json: Json = {};

    // Add index to return json
    await Promise.all(
      this.map(async (index) => {
        json[index.name] = await index.toJSON(req);
      }),
    );

    // Return json
    return json;
  }
}