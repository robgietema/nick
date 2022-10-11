/**
 * System groups vocabulary.
 * @module vocabularies/system-groups/system-groups
 */

import { arrayToVocabulary } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

/**
 * Returns the system groups vocabulary.
 * @method systemGroups
 * @returns {Array} Array of terms.
 */
export async function systemGroups(req, trx) {
  return arrayToVocabulary(config.systemGroups);
}
