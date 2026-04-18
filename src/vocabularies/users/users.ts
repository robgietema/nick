/**
 * Users vocabulary.
 * @module vocabularies/users/users
 */

import models from '../../models';
import type { Knex } from 'knex';
import type { Request, Vocabulary } from '../../types';

/**
 * Returns the users vocabulary.
 * @method users
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<Vocabulary>} Array of terms.
 */
export async function users(
  req: Request,
  trx: Knex.Transaction,
): Promise<Vocabulary> {
  const User = models.get('User');
  const users = await User.fetchAll({}, { order: 'fullname' }, trx);
  return users.getVocabulary(req);
}
