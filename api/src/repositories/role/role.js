/**
 * Role Repository.
 * @module repositories/role/role
 */

import { Role } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Role.
 * @class RoleRepository
 * @extends BaseRepository
 */
export class RoleRepository extends BaseRepository {
  /**
   * Construct a RoleRepository for Role.
   * @constructs RoleRepository
   */
  constructor() {
    super(Role);
  }
}

export default new RoleRepository();
