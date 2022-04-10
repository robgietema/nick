/**
 * Groups vocabulary.
 * @module vocabularies/groups/groups
 */

import { Group } from '../../models';

/**
 * Returns the groups vocabulary.
 * @method groups
 * @returns {Array} Array of terms.
 */
export async function groups(req, trx) {
  const groups = await Group.fetchAll({}, { order: 'title' }, trx);
  return groups.getVocabulary(req);
}
