/**
 * Action Model.
 * @module models/action/action
 */

import { Model } from '../../models';
import { ActionCollection } from '../../collections';

/**
 * A model for Action.
 * @class Action
 * @extends Model
 */
export class Action extends Model {
  static collection = ActionCollection;
}
