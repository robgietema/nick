/**
 * Permissions vocabulary.
 * @module vocabularies/permissions/permissions
 */

import { Permission } from '../../models/permission/permission';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

/**
 * Returns the permissions vocabulary.
 * @method permissions
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function permissions(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const permissions = await Permission.fetchAll({}, { order: 'title' }, trx);
  return permissions.getVocabulary(req);
}
