/**
 * Types vocabulary.
 * @module vocabularies/types/types
 */

import { Type } from '../../models';

/**
 * Returns the types vocabulary.
 * @method types
 * @returns {Array} Array of terms.
 */
export async function types(req, trx) {
  const types = await Type.fetchAll({}, { order: 'title' }, trx);
  return types.getVocabulary(req);
}
