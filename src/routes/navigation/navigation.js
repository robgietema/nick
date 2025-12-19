/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { Catalog } from '../../models/catalog/catalog';
import { Controlpanel } from '../../models/controlpanel/controlpanel';
import { Index } from '../../models/index/index';
import { getUrl } from '../../helpers/url/url';
import { compact, includes, map, split } from 'lodash';

export const handler = async (req, trx) => {
  const items = await Catalog.fetchAllRestricted(
    { _parent: req.navroot.uuid },
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

  // Fetch indexes
  if (!req.indexes) {
    req.indexes = await Index.fetchAll({}, {}, trx);
  }

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
            items: [],
          };
        }),
        ...map(await items.toJSON(req), (item) => {
          return {
            ...item,
            items: [],
          };
        }),
      ],
    },
  };
};

export default [
  {
    op: 'get',
    view: '/@navigation',
    permission: 'View',
    client: 'getNavigation',
    handler,
  },
];
