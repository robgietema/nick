/**
 * Vocabularies route.
 * @module routes/vocabularies/vocabularies
 */

import { keys, map } from 'lodash';

import { vocabularies } from '../../vocabularies';
import { getUrl } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@vocabularies',
    permission: 'View',
    handler: async (req, trx) => ({
      json: map(keys(vocabularies), (vocabulary) => ({
        '@id': `${getUrl(req)}/@vocabularies/${vocabulary}`,
        title: vocabulary,
      })),
    }),
  },
  {
    op: 'get',
    view: '/@vocabularies/:id',
    permission: 'View',
    handler: async (req, trx) => {
      const items = await vocabularies[req.params.id](req);
      return {
        json: {
          '@id': `${getUrl(req)}/@vocabularies/${req.params.id}`,
          items,
          items_total: items.length,
        },
      };
    },
  },
];
