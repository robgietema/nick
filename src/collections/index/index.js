/**
 * IndexCollection.
 * @module collection/index/index
 */

import { Collection } from '../../collections';
import _, { includes, map, omit } from 'lodash';

/**
 * Index Collection
 * @class IndexCollection
 * @extends Collection
 */
export class IndexCollection extends Collection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  async toJSON(req) {
    let json = {};

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
