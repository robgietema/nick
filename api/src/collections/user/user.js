/**
 * UserCollection.
 * @module collection/user/user
 */

import { BaseCollection } from '../../collections';

/**
 * user Collection
 * @class UserCollection
 * @extends BaseCollection
 */
export class UserCollection extends BaseCollection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Object} JSON object.
   */
  toJSON(req) {
    return this.map((model) => model.toJSON(req));
  }
}
