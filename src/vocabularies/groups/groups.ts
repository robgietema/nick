/**
 * Groups vocabulary.
 * @module vocabularies/groups/groups
 */

import models from '../../models';
import type { Knex } from 'knex';
import type { Request, Vocabulary } from '../../types';

/**
 * Returns the groups vocabulary.
 * @method groups
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<Vocabulary>} Array of terms.
 */
export async function groups(
  req: Request,
  trx: Knex.Transaction,
): Promise<Vocabulary> {
  const Group = models.get('Group');
  const groups = await Group.fetchAll({}, { order: 'title' }, trx);
  return groups.getVocabulary(req);
}
