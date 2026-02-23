/**
 * Captcha providers.
 * @module vocabularies/captcha-providers/captcha-providers
 */

import type { Knex } from 'knex';
import { objectToVocabulary } from '../../helpers/utils/utils';
import type { Request, VocabularyTerm } from '../../types';

const providers = {
  'norobots-captcha': 'NoRobots ReCaptcha Support',
};

/**
 * Returns the captcha providers vocabulary.
 * @method captchaProviders
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object
 * @returns {Promise<VocabularyTerm[]>} Array of terms.
 */
export async function captchaProviders(
  req: Request,
  trx: Knex.Transaction,
): Promise<VocabularyTerm[]> {
  return objectToVocabulary(providers);
}
