/**
 * ActionCollection.
 * @module collection/action/action
 */

import { BaseCollection } from '../../collections';
import _, { includes, map, omit } from 'lodash';

/**
 * Action Collection
 * @class ActionCollection
 * @extends BaseCollection
 */
export class ActionCollection extends BaseCollection {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object.
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    return _(super.toJSON())
      .filter((model) => includes(req.permissions, model.permission))
      .groupBy('category')
      .mapValues((category) =>
        map(category, (action) =>
          omit(action, ['order', 'permission', 'category']),
        ),
      )
      .value();
  }
}
