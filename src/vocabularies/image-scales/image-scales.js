/**
 * Image scales vocabulary.
 * @module vocabularies/image-scales/image-scales
 */

import { keys } from 'lodash';

import { config } from '../../../config';
import { arrayToVocabulary } from '../../helpers';

/**
 * Returns the image scales vocabulary.
 * @method imageScales
 * @returns {Array} Array of terms.
 */
export async function imageScales(req, trx) {
  return arrayToVocabulary(keys(config.imageScales));
}
