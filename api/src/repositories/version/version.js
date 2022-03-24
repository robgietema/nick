/**
 * Version Repository.
 * @module repositories/version/version
 */

import { Version } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Version.
 * @class VersionRepository
 * @extends BaseRepository
 */
export class VersionRepository extends BaseRepository {
  /**
   * Construct a VersionRepository for Version.
   * @constructs VersionRepository
   */
  constructor() {
    super(Version);
  }
}

export const versionRepository = new VersionRepository();
