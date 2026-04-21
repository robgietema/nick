/**
 * Search routes.
 * @module routes/search/search
 */

import { apiLimiter } from '../../helpers/limiter/limiter';
import {
  querystringToQuery,
  queryparamToQuery,
} from '../../helpers/query/query';
import { getUrl } from '../../helpers/url/url';

import models from '../../models';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'get',
    view: '/@search',
    permission: 'View',
    client: 'search',
    cache: 'dynamic',
    middleware: apiLimiter,
    handler: async (req: Request, trx: Knex.Transaction) => {
      const Catalog = models.get('Catalog');
      const Index = models.get('Index');
      const query = await queryparamToQuery(
        req.query,
        req.document.path,
        req,
        trx,
      );
      const items = await Catalog.fetchAllRestricted(
        query[0],
        query[1],
        trx,
        req,
      );

      // Fetch indexes
      if (!req.indexes) {
        req.indexes = await Index.fetchAll({}, {}, trx);
      }

      // Return JSON response
      return {
        json: {
          '@id': `${getUrl(req)}/@search`,
          items: items.map((item: any) => item.toJson(req)),
          items_total: items.getLength(),
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@querystring-search',
    permission: 'View',
    client: 'querystringSearch',
    cache: 'dynamic',
    middleware: apiLimiter,
    handler: async (req: Request, trx: Knex.Transaction) => {
      const Catalog = models.get('Catalog');
      const Index = models.get('Index');
      const query = await querystringToQuery(
        req.body,
        req.document.path,
        req,
        trx,
      );
      const items = await Catalog.fetchAllRestricted(
        query[0],
        query[1],
        trx,
        req,
      );

      // Fetch indexes
      if (!req.indexes) {
        req.indexes = await Index.fetchAll({}, {}, trx);
      }

      // Return JSON response
      return {
        json: {
          '@id': `${getUrl(req)}/@search`,
          items: items.map((item: any) => item.toJson(req)),
          items_total: items.getLength(),
        },
      };
    },
  },
];
