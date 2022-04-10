/**
 * Supported languages vocabulary.
 * @module vocabularies/supported-languages/supported-languages
 */

import { config } from '../../../config';
import { arrayToVocabulary } from '../../helpers';

/**
 * Returns the supported languages vocabulary.
 * @method supportedLanguages
 * @returns {Array} Array of terms.
 */
export async function supportedLanguages(req, trx) {
  return arrayToVocabulary(config.supportedLanguages);
}
