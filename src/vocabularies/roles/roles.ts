/**
 * Roles vocabulary.
 * @module vocabularies/roles/roles
 */

import models from '../../models';
import type { Knex } from 'knex';
import type { Request, Vocabulary } from '../../types';

/**
 * Returns the roles vocabulary.
 * @method roles
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<Vocabulary>} Array of terms.
 */
export async function roles(
  req: Request,
  trx: Knex.Transaction,
): Promise<Vocabulary> {
  const Role = models.get('Role');
  const roles = await Role.fetchAll({}, { order: 'title' }, trx);
  return roles.getVocabulary(req);
}
