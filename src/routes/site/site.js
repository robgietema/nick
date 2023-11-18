/**
 * Site route.
 * @module routes/site/site
 */

import { Controlpanel } from '../../models';
import { getRootUrl } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@site',
    permission: 'View',
    handler: async (req, trx) => {
      const controlpanel = await Controlpanel.fetchById('site');
      const config = controlpanel.data;

      // Return database information
      return {
        json: {
          '@id': `${getRootUrl(req)}/@site`,
          robots_txt: config?.robots_txt,
          site_logo: config?.site_logo,
          site_title: config?.site_title,
        },
      };
    },
  },
];
