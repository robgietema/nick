/**
 * System groups vocabulary.
 * @module vocabularies/system-groups/system-groups
 */

import { config } from '../../../config';
import { arrayToVocabulary } from '../../helpers';

/**
 * Returns the system groups vocabulary.
 * @method systemGroups
 * @returns {Array} Array of terms.
 */
export async function systemGroups(req, trx) {
  return arrayToVocabulary(config.systemGroups);
}
