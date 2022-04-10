/**
 * Users vocabulary.
 * @module vocabularies/users/users
 */

import { User } from '../../models';

/**
 * Returns the users vocabulary.
 * @method users
 * @returns {Array} Array of terms.
 */
export async function users(req, trx) {
  const users = await User.fetchAll({}, { order: 'fullname' }, trx);
  return users.getVocabulary(req);
}
