/**
 * System groups vocabulary.
 * @module vocabularies/system-groups/system-groups
 */

import { arrayToVocabulary } from '../../helpers/utils/utils';

import config from '../../helpers/config/config';

/**
 * Returns the system groups vocabulary.
 * @method systemGroups
 * @returns {Array} Array of terms.
 */
export async function systemGroups(req, trx) {
  return arrayToVocabulary(config.settings.systemGroups);
}
