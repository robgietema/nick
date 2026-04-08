/**
 * Behaviors vocabulary.
 * @module vocabularies/behaviors/behaviors
 */

import type { Knex } from 'knex';
import models from '../../models';
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
  const Behavior = models.get('Behavior');
  const behaviors = await Behavior.fetchAll({}, { order: 'title' }, trx);
  return behaviors.getVocabulary(req);
}
