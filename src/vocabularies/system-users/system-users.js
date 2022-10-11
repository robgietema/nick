/**
 * System users vocabulary.
 * @module vocabularies/system-users/system-users
 */

import { arrayToVocabulary } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

/**
 * Returns the system users vocabulary.
 * @method systemUsers
 * @returns {Array} Array of terms.
 */
export async function systemUsers(req, trx) {
  return arrayToVocabulary(config.systemUsers);
}
