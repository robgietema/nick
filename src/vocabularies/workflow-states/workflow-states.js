/**
 * Workflows vocabulary.
 * @module vocabularies/workflows/workflows
 */

import { mapValues } from 'lodash';

import { Workflow } from '../../models';
import { objectToVocabulary } from '../../helpers';

/**
 * Returns the workflows vocabulary.
 * @method workflows
 * @returns {Array} Array of terms.
 */
export async function workflowStates(req, trx) {
  let states = {};
  const workflows = await Workflow.fetchAll({}, { order: 'title' }, trx);

  // Get states
  workflows.map((workflow) =>
    mapValues(workflow.json.states, (value, key) => {
      states[key] = value.title;
    }),
  );

  // Return states
  return objectToVocabulary(states);
}
