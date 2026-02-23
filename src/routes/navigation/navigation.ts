/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { Catalog } from '../../models/catalog/catalog';
import { Controlpanel } from '../../models/controlpanel/controlpanel';
import { Index } from '../../models/index/index';
import { getUrl } from '../../helpers/url/url';
import { compact } from 'es-toolkit/array';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export const handler = async (req: Request, trx: Knex.Transaction) => {
  const items = await Catalog.fetchAllRestricted(
    { _parent: req.navroot.uuid },
    { order: '_getObjPositionInParent' },
    trx,
    req,
  );

  // Omit exclude from nav items
  items.filter((item: any) => !item.exclude_from_nav);

  // Fetch settings
  const controlpanel = await Controlpanel.fetchById('navigation', {}, trx);
  const settings = controlpanel.data;

  // Omit by type
  items.filter((item: any) => settings.displayed_types.includes(item.Type));

  // Fetch indexes
  if (!req.indexes) {
    req.indexes = await Index.fetchAll({}, {}, trx);
  }

  // Return navigation
  return {
    json: {
      '@id': `${getUrl(req)}/@navigation`,
      items: [
        ...compact(settings.additional_items.split('\n')).map((item: any) => {
          const navitem = item.split('|');
          return {
            title: navitem[0],
            description: navitem[1],
            '@id': navitem[2],
            items: [],
          };
        }),
        ...(await items.toJson(req)).map((item: any) => {
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
