/**
 * Subjects vocabulary.
 * @module vocabularies/subjects/subjects
 */

import { uniq } from 'es-toolkit/array';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

import { Catalog } from '../../models/catalog/catalog';
import { arrayToVocabulary } from '../../helpers/utils/utils';

/**
 * Returns the subjects vocabulary.
 * @method subjects
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function subjects(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  const subjects = await Catalog.fetchAll(
    { _Subject: ['is not', null] },
    {},
    trx,
  );
  return arrayToVocabulary(
    uniq([...subjects.map((subject: any) => subject._Subject)].flat()),
  );
}
