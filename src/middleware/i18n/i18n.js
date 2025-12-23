/**
 * I18n middleware.
 * @module i18n
 */

import { remove, zipObject } from 'es-toolkit/array';
import { createIntl, createIntlCache } from '@formatjs/intl';
import fs from 'fs';

import { Controlpanel } from '../../models/controlpanel/controlpanel';

// Get available language files
const languages = remove(
  fs.readdirSync(`${__dirname}/../../../locales`),
  (value) => value.endsWith('.json'),
).map((value) => value.replace(/.json/, ''));

// Create i18n cache
const intlCache = zipObject(
  languages,
  languages.map(() => createIntlCache()),
);

// Load i18n files
const intl = zipObject(
  languages,
  languages.map((language) =>
    createIntl(
      {
        locale: language,
        messages: JSON.parse(
          fs.readFileSync(
            `${__dirname}/../../../locales/${language}.json`,
            'utf8',
          ),
        ),
      },
      intlCache[language],
    ),
  ),
);

// Export middleware
export async function i18n(req, res, next) {
  // Fetch settings
  const controlpanel = await Controlpanel.fetchById('language');
  const settings = controlpanel.data;

  req.i18n = (id, ...rest) => {
    // Check if id is specified
    if (!id) {
      return id;
    }

    // Negotiate language
    let language =
      req.acceptsLanguages(...settings.available_languages) ||
      settings.default_language;

    // Check if language is available
    if (!languages.includes(language)) {
      language = settings.default_language;
    }

    // Translate message
    return intl[language].formatMessage({ id, defaultMessage: id }, ...rest);
  };
  next();
}
