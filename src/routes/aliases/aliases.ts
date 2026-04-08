/**
 * Aliases routes.
 * @module routes/aliases/aliases
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import { Redirect } from '../../models/redirect/redirect';
import { mapAsync } from '../../helpers/utils/utils';
import { Document } from '../../models/document/document';
import { getUrl } from '../../helpers/url/url';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'get',
    view: '/@aliases',
    permission: 'View',
    client: 'getAliases',
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const options = {
        ...(req.query.query ? { path: ['like', `%${req.query.query}%`] } : {}),
        ...(typeof req.query.manual !== 'undefined'
          ? { manual: req.query.manual === 'true' }
          : {}),
        ...(typeof req.query.start !== 'undefined'
          ? { datetime: ['>=', req.query.start] }
          : {}),
        ...(typeof req.query.end !== 'undefined'
          ? { datetime: ['<=', req.query.end] }
          : {}),
        ...(typeof req.query.b_start !== 'undefined'
          ? { offset: parseInt(req.query.b_start, 10) }
          : {}),
        ...(typeof req.query.b_size !== 'undefined'
          ? { limit: parseInt(req.query.b_size, 10) }
          : {}),
      };
      const redirects = await Redirect.fetchAll(
        {
          ...(req.document.uuid === req.navroot.uuid
            ? {}
            : { document: ['=', req.document.uuid] }),
          ...options,
        },
        { related: '_document' },
        trx,
      );
      const items = await redirects.toJson(req);
      return {
        json: {
          '@id': `${getUrl(req)}/@aliases`,
          items,
          items_total: items.length,
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@aliases',
    permission: 'Add',
    client: 'createAliases',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      // Set creation time
      const created = dayjs.utc().format();
      const root = req.document.uuid === req.navroot.uuid;

      const items = req.body.items || [];
      await mapAsync(items, async (item: any) => {
        const document = root
          ? (await Document.fetchOne({ path: item['redirect-to'] }, {}, trx))
              .uuid
          : req.document.uuid;
        await Redirect.create(
          {
            document,
            path: item.path,
            manual: true,
            datetime: created,
          },
          {},
          trx,
        );
      });

      // Send created
      return {
        status: 201,
      };
    },
  },
  {
    op: 'delete',
    view: '/@aliases',
    permission: 'Modify',
    client: 'deleteAliases',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const items = req.body.items || [];
      await mapAsync(items, async (item: any) => {
        await Redirect.delete(
          { document: req.document.uuid, path: item.path },
          trx,
        );
      });
      return {
        status: 204,
      };
    },
  },
];
