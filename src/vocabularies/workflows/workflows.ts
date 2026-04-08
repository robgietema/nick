/**
 * Workflows vocabulary.
 * @module vocabularies/workflows/workflows
 */

import models from '../../models';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

/**
 * Returns the workflows vocabulary.
 * @method workflows
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function workflows(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const Workflow = models.get('Workflow');
  const workflows = await Workflow.fetchAll({}, { order: 'title' }, trx);
  return workflows.getVocabulary(req);
}
