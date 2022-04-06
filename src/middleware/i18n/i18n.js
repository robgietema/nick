/**
 * I18n middleware.
 * @module i18n
 */

import { map, zipObject } from 'lodash';
import { createIntl, createIntlCache } from '@formatjs/intl';

import { config } from '../../../config';

// Create i18n cache
const intlCache = zipObject(
  config.supportedLanguages,
  map(config.supportedLanguages, () => createIntlCache()),
);

// Load i18n files
const intl = zipObject(
  config.supportedLanguages,
  map(config.supportedLanguages, (language) =>
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
export function i18n(req, res, next) {
  req.i18n = (id, ...rest) => {
    if (!id) {
      return id;
    }
    return intl[
      req.acceptsLanguages(...config.supportedLanguages) ||
        config.defaultLanguage
    ].formatMessage({ id, defaultMessage: id }, ...rest);
  };
  next();
}
