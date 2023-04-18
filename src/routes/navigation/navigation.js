/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { Catalog, Controlpanel, Document } from '../../models';
import { getUrl } from '../../helpers';
import { compact, includes, map, split } from 'lodash';

export default [
  {
    op: 'get',
    view: '/@navigation',
    permission: 'View',
    handler: async (req, trx) => {
      const root = await Document.fetchOne({ parent: null }, {}, trx);
      const items = await Catalog.fetchAllRestricted(
        { _parent: root.uuid },
        { order: '_getObjPositionInParent' },
        trx,
        req,
      );

      // Omit exclude from nav items
      items.omitBy((item) => item.exclude_from_nav);

      // Fetch settings
      const controlpanel = await Controlpanel.fetchById('navigation', {}, trx);
      const settings = controlpanel.data;

      // Omit by type
      items.omitBy((item) => !includes(settings.displayed_types, item.Type));

      // Return navigation
      return {
        json: {
          '@id': `${getUrl(req)}/@navigation`,
          items: [
            ...map(compact(split(settings.additional_items, '\n')), (item) => {
              const navitem = item.split('|');
              return {
                title: navitem[0],
                description: navitem[1],
                '@id': navitem[2],
              };
            }),
            ...(await items.toJSON(req)),
          ],
        },
      };
    },
  },
];
