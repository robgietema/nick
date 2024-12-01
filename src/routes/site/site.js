/**
 * Site route.
 * @module routes/site/site
 */

import { last } from 'lodash';
import { Controlpanel } from '../../models';
import { getRootUrl } from '../../helpers';
const { config } = require(`${process.cwd()}/config`);

export default [
  {
    op: 'get',
    view: '/@site',
    permission: 'View',
    handler: async (req, trx) => {
      const controlpanel = await Controlpanel.fetchById('site', {}, trx);
      const site = controlpanel.data;

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@site`,
          'plone.robots_txt': site?.robots_txt,
          'plone.site_logo': site?.site_logo
            ? `${config.frontendUrl}/en/@@images/${site.site_logo.uuid}.${last(site.site_logo.filename.split('.'))}`
            : null,
          'plone.site_title': site?.site_title,
        },
      };
    },
  },
];
