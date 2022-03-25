/**
 * Behavior Repository.
 * @module repositories/behavior/behavior
 */

import { Behavior } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Behavior.
 * @class BehaviorRepository
 * @extends BaseRepository
 */
export class BehaviorRepository extends BaseRepository {
  /**
   * Construct a BehaviorRepository for Behavior.
   * @constructs BehaviorRepository
   */
  constructor() {
    super(Behavior);
  }
}

export const behaviorRepository = new BehaviorRepository();
