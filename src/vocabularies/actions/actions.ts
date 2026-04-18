/**
 * Actions vocabulary.
 * @module vocabularies/actions/actions
 */

import type { Knex } from 'knex';
import models from '../../models';
import type { Request, Vocabulary } from '../../types';

/**
 * Returns the acions vocabulary.
 * @method actions
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<Vocabulary>} Array of terms.
 */
export async function actions(
  req: Request,
  trx: Knex.Transaction,
): Promise<Vocabulary> {
  const Action = models.get('Action');
  const actions = await Action.fetchAll(
    {},
    { order: ['category', 'order'] },
    trx,
  );
  return actions.getVocabulary(req);
}
