/**
 * ActionCollection.
 * @module collection/action/action
 */

import { Collection } from '../../collections';
import _, { includes, map, omit } from 'lodash';
import type { Json, Model, Request } from '../../types';

interface ActionModel extends Model {
  permission: string;
  category: string;
  order: number;
  url?: string;
}

/**
 * Action Collection
 * @class ActionCollection
 * @extends Collection
 */
export class ActionCollection extends Collection<ActionModel> {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Request} req Request object.
   * @returns {Promise<Json>} JSON object grouped by category.
   */
  async toJSON(req: Request): Promise<Json> {
    return _(await super.toJSON(req) as any)
      .filter((model) => includes(req.permissions, model?.permission))
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