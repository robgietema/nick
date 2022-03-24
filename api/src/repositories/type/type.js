/**
 * Type Repository.
 * @module repositories/type/type
 */

import { Type } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Type.
 * @class TypeRepository
 * @extends BaseRepository
 */
export class TypeRepository extends BaseRepository {
  /**
   * Construct a TypeRepository for Type.
   * @constructs TypeRepository
   */
  constructor() {
    super(Type);
  }
}

export const typeRepository = new TypeRepository();
