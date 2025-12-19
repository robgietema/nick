/**
 * Site route.
 * @module routes/site/site
 */

import { last } from 'lodash';

import { getRootUrl } from '../../helpers/url/url';
import config from '../../helpers/config/config';

import { Controlpanel } from '../../models/controlpanel/controlpanel';

export default [
  {
    op: 'get',
    view: '/@site',
    permission: 'View',
    client: 'getSite',
    handler: async (req, trx) => {
      const siteControlpanel = await Controlpanel.fetchById('site', {}, trx);
      const languageControlpanel = await Controlpanel.fetchById(
        'language',
        {},
        trx,
      );
      const site = siteControlpanel.data;
      const language = languageControlpanel.data;

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@site`,
          features: {
            multilingual: language?.multilingual,
          },
          'plone.robots_txt': site?.robots_txt,
          'plone.site_logo': site?.site_logo
            ? `${config.settings.frontendUrl}/en/@@images/${site.site_logo.uuid}.${last(site.site_logo.filename.split('.'))}`
            : null,
          'plone.site_title': site?.site_title,
          'plone.available_languages': language?.available_languages,
          'plone.default_language': language?.default_language,
        },
      };
    },
  },
];
