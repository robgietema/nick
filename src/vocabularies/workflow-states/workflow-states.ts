/**
 * Workflows vocabulary.
 * @module vocabularies/workflows/workflows
 */

import { mapValues } from 'es-toolkit/object';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

import { Workflow } from '../../models/workflow/workflow';
import { objectToVocabulary } from '../../helpers/utils/utils';

/**
 * Returns the workflows vocabulary.
 * @method workflows
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function workflowStates(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const states = {} as Record<string, string>;
  const workflows = await Workflow.fetchAll({}, { order: 'title' }, trx);

  // Get states
  workflows.map((workflow: any) =>
    mapValues(workflow.json.states, (value, key: string) => {
      states[key] = value.title;
    }),
  );

  // Return states
  return objectToVocabulary(states);
}
