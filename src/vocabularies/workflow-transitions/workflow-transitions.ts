/**
 * Workflows transitions vocabulary.
 * @module vocabularies/workflows-transitions/workflows-transitions
 */

import { mapValues } from 'es-toolkit/object';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

import models from '../../models';
import { objectToVocabulary } from '../../helpers/utils/utils';

/**
 * Returns the workflows transitions vocabulary.
 * @method workflowTransitions
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function workflowTransitions(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const Workflow = models.get('Workflow');
  const transitions = {} as Record<string, string>;
  const workflows = await Workflow.fetchAll({}, { order: 'title' }, trx);

  // Get transitions
  workflows.map((workflow: any) =>
    mapValues(workflow.json.transitions, (value, key: string) => {
      transitions[key] = value.title;
    }),
  );

  // Return transitions
  return objectToVocabulary(transitions);
}
