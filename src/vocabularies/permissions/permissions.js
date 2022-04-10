/**
 * Permissions vocabulary.
 * @module vocabularies/permissions/permissions
 */

import { Permission } from '../../models';

/**
 * Returns the permissions vocabulary.
 * @method permissions
 * @returns {Array} Array of terms.
 */
export async function permissions(req, trx) {
  const permissions = await Permission.fetchAll({}, { order: 'title' }, trx);
  return permissions.getVocabulary(req);
}
