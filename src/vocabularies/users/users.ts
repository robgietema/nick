/**
 * Users vocabulary.
 * @module vocabularies/users/users
 */

import { User } from '../../models/user/user';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

/**
 * Returns the users vocabulary.
 * @method users
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function users(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const users = await User.fetchAll({}, { order: 'fullname' }, trx);
  return users.getVocabulary(req);
}
