/**
 * Subjects vocabulary.
 * @module vocabularies/subjects/subjects
 */

import { concat, uniq } from 'lodash';

import { Catalog } from '../../models/catalog/catalog';
import { arrayToVocabulary } from '../../helpers/utils/utils';

/**
 * Returns the subjects vocabulary.
 * @method subjects
 * @returns {Array} Array of terms.
 */
export async function subjects(req, trx) {
  const subjects = await Catalog.fetchAll(
    { _Subject: ['is not', null] },
    {},
    trx,
  );
  return arrayToVocabulary(
    uniq(concat(...subjects.map((subject) => subject._Subject))),
  );
}
