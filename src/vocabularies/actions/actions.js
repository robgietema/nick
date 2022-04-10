/**
 * Actions vocabulary.
 * @module vocabularies/actions/actions
 */

import { Action } from '../../models';

/**
 * Returns the acions vocabulary.
 * @method actions
 * @returns {Array} Array of terms.
 */
export async function actions(req, trx) {
  const actions = await Action.fetchAll({}, { order: 'title' }, trx);
  return actions.getVocabulary(req);
}
