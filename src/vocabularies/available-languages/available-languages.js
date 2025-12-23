/**
 * Available languages vocabulary.
 * @module vocabularies/available-languages/available-languages
 */

import { pick } from 'es-toolkit/object';

import { Controlpanel } from '../../models/controlpanel/controlpanel';
import languages from '../../constants/languages';
import { objectToVocabulary } from '../../helpers/utils/utils';

/**
 * Returns the available languages vocabulary.
 * @method availableLanguages
 * @returns {Array} Array of terms.
 */
export async function availableLanguages(req, trx) {
  // Fetch settings
  const controlpanel = await Controlpanel.fetchById('language', {}, trx);
  const settings = controlpanel.data;

  // Return languages
  return objectToVocabulary(pick(languages, settings.available_languages));
}
