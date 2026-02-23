/**
 * Actions vocabulary.
 * @module vocabularies/actions/actions
 */

import type { Knex } from 'knex';
import { Action } from '../../models/action/action';
import type { Request, VocabularyTerm } from '../../types';

/**
 * Returns the acions vocabulary.
 * @method actions
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function actions(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const actions = await Action.fetchAll(
    {},
    { order: ['category', 'order'] },
    trx,
  );
  return actions.getVocabulary(req);
}
