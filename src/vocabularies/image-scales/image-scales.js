/**
 * Image scales vocabulary.
 * @module vocabularies/image-scales/image-scales
 */

import { keys } from 'lodash';

import { arrayToVocabulary } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

/**
 * Returns the image scales vocabulary.
 * @method imageScales
 * @returns {Array} Array of terms.
 */
export async function imageScales(req, trx) {
  return arrayToVocabulary(keys(config.imageScales));
}
