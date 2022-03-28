/**
 * GroupCollection.
 * @module collection/group/group
 */

import { BaseCollection } from '../../collections';

/**
 * Group Collection
 * @class GroupCollection
 * @extends BaseCollection
 */
export class GroupCollection extends BaseCollection {
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
