/**
 * Behaviors vocabulary.
 * @module vocabularies/behaviors/behaviors
 */

import { Behavior } from '../../models';

/**
 * Returns the behaviors vocabulary.
 * @method behaviors
 * @returns {Array} Array of terms.
 */
export async function behaviors(req, trx) {
  const behaviors = await Behavior.fetchAll({}, { order: 'title' }, trx);
  return behaviors.getVocabulary(req);
}
