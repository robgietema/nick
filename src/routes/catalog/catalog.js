/**
 * Catalog route.
 * @module routes/catalog/catalog
 */

import { getUrl } from '../../helpers';

export const handler = async (req, trx) => {
  await req.document.fetchRelated('_catalog', trx);

  if (req.document._children) {
    await mapAsync(req.document._children, async (child) => {
      await child.fetchRelated('_catalog', trx);
      await child.fetchRelationLists(trx);
    });
  }

  // Get base url
  const baseUrl = getUrl(req);

  return {
    json: {
      ...req.document._catalog.toJSON(req),
      '@id': `${baseUrl}/@catalog`,
    },
  };
};

export default [
  {
    op: 'get',
    view: '/@catalog',
    permission: 'View',
    client: 'getCatalog',
    handler,
  },
];
