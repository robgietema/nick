/**
 * Action Model.
 * @module models/action/action
 */

import { BaseModel } from '../../helpers';
import { ActionCollection } from '../../collections';

/**
 * A model for Action.
 * @class Action
 * @extends BaseModel
 */
export class Action extends BaseModel {
  static collection = ActionCollection;
}
