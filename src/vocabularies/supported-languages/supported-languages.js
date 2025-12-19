/**
 * Supported languages vocabulary.
 * @module vocabularies/supported-languages/supported-languages
 */

import languages from '../../constants/languages';
import { objectToVocabulary } from '../../helpers/utils/utils';

/**
 * Returns the supported languages vocabulary.
 * @method supportedLanguages
 * @returns {Array} Array of terms.
 */
export async function supportedLanguages(req, trx) {
  return objectToVocabulary(languages);
}
