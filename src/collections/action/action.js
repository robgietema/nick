/**
 * ActionCollection.
 * @module collection/action/action
 */

import { Collection } from '../../collections';
import _, { includes, map, omit } from 'lodash';

/**
 * Action Collection
 * @class ActionCollection
 * @extends Collection
 */
export class ActionCollection extends Collection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  async toJSON(req) {
    return _(super.toJSON())
      .filter((model) => includes(req.permissions, model.permission))
      .groupBy('category')
      .mapValues((category) =>
        map(category, (action) => ({
          ...omit(action, ['order', 'permission', 'category']),
          url: action.url ? action.url.replace('$username', req.user.id) : null,
        })),
      )
      .value();
  }
}
