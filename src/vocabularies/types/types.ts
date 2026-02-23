/**
 * Types vocabulary.
 * @module vocabularies/types/types
 */

import { Type } from '../../models/type/type';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

/**
 * Returns the types vocabulary.
 * @method types
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function types(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const types = await Type.fetchAll({}, { order: 'title' }, trx);
  return types.getVocabulary(req);
}
