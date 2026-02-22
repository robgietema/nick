/**
 * I18n middleware.
 * @module i18n
 */

import { remove, zipObject } from 'es-toolkit/array';
import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl';
import fs from 'fs';
import type { Response, NextFunction } from 'express';

import { Controlpanel } from '../../models/controlpanel/controlpanel';

import config from '../../helpers/config/config';
import type { Request } from '../../types';

// Get available language files
const languages = remove(
  fs.readdirSync(`${config.settings.localesDir}`),
  (value) => value.endsWith('.json'),
).map((value) => value.replace(/.json/, ''));

// Create i18n cache
const intlCache = zipObject(
  languages,
  languages.map(() => createIntlCache()),
) as Record<string, any>;

// Load i18n files
const intl = zipObject(
  languages,
  languages.map((language) =>
    createIntl(
      {
        locale: language,
        messages: JSON.parse(
          fs.readFileSync(
            `${config.settings.localesDir}/${language}.json`,
            'utf8',
          ),
        ),
      },
      intlCache[language],
    ),
  ),
) as Record<string, IntlShape>;

// Export middleware
export async function i18n(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Fetch settings
  const controlpanel = await Controlpanel.fetchById('language');
  const settings = (controlpanel as any).data;

  req.i18n = (id: string, ...rest: any[]) => {
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
    return (intl[language] as any).formatMessage(
      { id, defaultMessage: id },
      ...rest,
    );
  };
  next();
}
