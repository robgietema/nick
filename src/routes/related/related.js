/**
 * Related route.
 * @module routes/related/related
 */

import { filter } from 'lodash';

import { getUrl } from '../../helpers';
import { Catalog } from '../../models/catalog/catalog';

const { config } = require(`${process.cwd()}/config`);

export const handler = async (req, trx) => {
  // Check if ai enabled
  if (!config.ai?.enabled) {
    throw new RequestException(400, {
      message: req.i18n('AI is disabled.'),
    });
  }

  // Fetch the catalog related to the document
  await req.document.fetchRelated('_catalog', trx);

  // Fetch catalog items with closest embeddings
  const items = await Catalog.fetchClosestEmbeddingRestricted(
    req.document._catalog._embedding,
    5,
    trx,
    req,
  );

  // Get base url
  const baseUrl = getUrl(req);

  return {
    json: {
      '@id': `${baseUrl}/@related`,
      items: filter(
        items.map((item) => item.toJSON(req)),
        (item) => item.UID !== req.document._catalog.UID,
      ),
    },
  };
};

export default [
  {
    op: 'get',
    view: '/@related',
    permission: 'View',
    client: 'getRelated',
    handler,
  },
];
