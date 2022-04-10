/**
 * Workflows vocabulary.
 * @module vocabularies/workflows/workflows
 */

import { Workflow } from '../../models';

/**
 * Returns the workflows vocabulary.
 * @method workflows
 * @returns {Array} Array of terms.
 */
export async function workflows(req, trx) {
  const workflows = await Workflow.fetchAll({}, { order: 'title' }, trx);
  return workflows.getVocabulary(req);
}
