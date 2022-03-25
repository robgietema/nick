/**
 * Action Repository.
 * @module repositories/action/action
 */

import { Action } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Action.
 * @class ActionRepository
 * @extends BaseRepository
 */
export class ActionRepository extends BaseRepository {
  /**
   * Construct a ActionRepository for Action.
   * @constructs ActionRepository
   */
  constructor() {
    super(Action);
  }
}

export const actionRepository = new ActionRepository();
