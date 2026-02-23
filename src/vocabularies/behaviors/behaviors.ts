/**
 * Behaviors vocabulary.
 * @module vocabularies/behaviors/behaviors
 */

import type { Knex } from 'knex';
import { Behavior } from '../../models/behavior/behavior';
import type { Request, VocabularyTerm } from '../../types';

/**
 * Returns the behaviors vocabulary.
 * @method behaviors
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function behaviors(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const behaviors = await Behavior.fetchAll({}, { order: 'title' }, trx);
  return behaviors.getVocabulary(req);
}
