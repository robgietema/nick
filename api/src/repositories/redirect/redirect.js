/**
 * Redirect Repository.
 * @module repositories/redirect/redirect
 */

import { Redirect } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Redirect.
 * @class RedirectRepository
 * @extends BaseRepository
 */
export class RedirectRepository extends BaseRepository {
  /**
   * Construct a RoleRepository for Role.
   * @constructs RoleRepository
   */
  constructor() {
    super(Redirect);
  }
}

export const redirectRepository = new RedirectRepository();
