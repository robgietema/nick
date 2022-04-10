/**
 * System users vocabulary.
 * @module vocabularies/system-users/system-users
 */

import { config } from '../../../config';
import { arrayToVocabulary } from '../../helpers';

/**
 * Returns the system users vocabulary.
 * @method systemUsers
 * @returns {Array} Array of terms.
 */
export async function systemUsers(req, trx) {
  return arrayToVocabulary(config.systemUsers);
}
