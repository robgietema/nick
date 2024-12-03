/**
 * Captcha providers.
 * @module vocabularies/captcha-providers/captcha-providers
 */

import { objectToVocabulary } from '../../helpers';
const providers = {
  'norobots-captcha': 'NoRobots ReCaptcha Support',
};

/**
 * Returns the captcha providers vocabulary.
 * @method captchaProviders
 * @returns {Array} Array of terms.
 */
export async function captchaProviders(req, trx) {
  return objectToVocabulary(providers);
}
