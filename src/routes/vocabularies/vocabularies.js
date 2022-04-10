/**
 * Vocabularies route.
 * @module routes/vocabularies/vocabularies
 */

import { includes, keys, map } from 'lodash';

import { vocabularies } from '../../vocabularies';
import { RequestException, getUrl } from '../../helpers';

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
      // Check if vocabulary is available
      if (!includes(keys(vocabularies), req.params.id)) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }

      // Get items
      const items = await vocabularies[req.params.id](req);

      // Return data
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
