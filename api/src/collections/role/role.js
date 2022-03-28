/**
 * RoleCollection.
 * @module collection/role/role
 */

import { BaseCollection } from '../../collections';

/**
 * Role Collection
 * @class RoleCollection
 * @extends BaseCollection
 */
export class RoleCollection extends BaseCollection {
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
