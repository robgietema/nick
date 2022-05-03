/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { Document } from '../../models';
import { getUrl } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@navigation',
    permission: 'View',
    handler: async (req, trx) => {
      const root = await Document.fetchOne({ parent: null }, {}, trx);
      const items = await Document.fetchAll(
        { parent: root.uuid },
        { order: 'position_in_parent' },
        trx,
      );

      // Omit exclude from nav items
      items.omitBy((item) => item.json?.exclude_from_nav);

      // Return navigation
      return {
        json: {
          '@id': `${getUrl(req)}/@navigation`,
          items: await items.toJSON(req),
        },
      };
    },
  },
];
