/**
 * Action Model.
 * @module models/action/action
 */

import { Model } from '../../models/_model/_model';
import { ActionCollection } from '../../collections/action/action';

/**
 * A model for Action.
 * @class Action
 * @extends Model
 */
export class Action extends Model {
  static collection: (typeof Model)['collection'] =
    ActionCollection as unknown as (typeof Model)['collection'];
}
