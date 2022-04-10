/**
 * Roles vocabulary.
 * @module vocabularies/roles/roles
 */

import { Role } from '../../models';

/**
 * Returns the roles vocabulary.
 * @method roles
 * @returns {Array} Array of terms.
 */
export async function roles(req, trx) {
  const roles = await Role.fetchAll({}, { order: 'title' }, trx);
  return roles.getVocabulary(req);
}
