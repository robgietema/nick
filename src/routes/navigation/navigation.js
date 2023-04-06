/**
 * Navigation routes.
 * @module routes/navigation/navigation
 */

import { Catalog, Document, Type } from '../../models';
import { getUrl } from '../../helpers';
import { includes } from 'lodash';

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

      // Omit by type
      const types = await Type.fetchAll({}, {}, trx);
      types.omitBy((type) => type.exclude_from_nav === false);
      const excludedTypes = types.map((type) => type.id);
      items.omitBy((item) => includes(excludedTypes, item.Type));

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
