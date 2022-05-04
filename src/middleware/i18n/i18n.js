/**
 * I18n middleware.
 * @module i18n
 */

import _, { endsWith, includes, map, zipObject } from 'lodash';
import { createIntl, createIntlCache } from '@formatjs/intl';
import fs from 'fs';

import { config } from '../../../config';
import { Controlpanel } from '../../models';

// Get available language files
const languages = _(fs.readdirSync(`${__dirname}/../../../locales`))
  .remove((value) => endsWith(value, '.json'))
  .map((value) => value.replace(/.json/, ''))
  .value();

// Create i18n cache
const intlCache = zipObject(
  languages,
  map(languages, () => createIntlCache()),
);

// Load i18n files
const intl = zipObject(
  languages,
  map(languages, (language) =>
    createIntl(
      {
        locale: language,
        messages: require(`../../../locales/${language}.json`),
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
    if (!includes(languages, language)) {
      language = settings.default_language;
    }

    // Translate message
    return intl[language].formatMessage({ id, defaultMessage: id }, ...rest);
  };
  next();
}
