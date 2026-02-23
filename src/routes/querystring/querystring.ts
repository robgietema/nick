/**
 * Action route.
 * @module routes/actions/actions
 */

import { getUrl } from '../../helpers/url/url';
import { Index } from '../../models/index/index';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'get',
    view: '/@querystring',
    permission: 'View',
    client: 'getQuerystring',
    handler: async (req: Request, trx: Knex.Transaction) => {
      // Get all enabled indexes
      const indexes = await Index.fetchAll(
        { enabled: true, metadata: false },
        { order: 'title' },
        trx,
      );

      // Get all enabled and sortable indexes
      const sortableIndexes = await Index.fetchAll(
        { sortable: true, enabled: true, metadata: false },
        { order: 'title' },
        trx,
      );

      // Return data
      return {
        json: {
          '@id': `${getUrl(req)}/@querystring`,
          indexes: await indexes.toJson(req),
          sortable_indexes: await sortableIndexes.toJson(req),
        },
      };
    },
  },
];
