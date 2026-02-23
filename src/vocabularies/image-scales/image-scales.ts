/**
 * Image scales vocabulary.
 * @module vocabularies/image-scales/image-scales
 */

import { arrayToVocabulary } from '../../helpers/utils/utils';
import type { Knex } from 'knex';
import type { Request, VocabularyTerm } from '../../types';

import config from '../../helpers/config/config';

/**
 * Returns the image scales vocabulary.
 * @method imageScales
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function imageScales(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  return arrayToVocabulary(Object.keys(config.settings.imageScales));
}
