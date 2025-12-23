/**
 * ActionCollection.
 * @module collection/action/action
 */

import { Collection } from '../../collections/_collection/_collection';
import { groupBy } from 'es-toolkit/array';
import { mapValues, omit } from 'es-toolkit/object';

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
    return mapValues(
      groupBy(
        ((await super.toJSON(req)) as any[]).filter((model) =>
          req.permissions.includes(model.permission),
        ),
        (model) => model.category,
      ),
      (category) =>
        category.map((action) => ({
          ...omit(action, ['order', 'permission', 'category']),
          url: action.url ? action.url.replace('$username', req.user.id) : null,
        })),
    );
  }
}
