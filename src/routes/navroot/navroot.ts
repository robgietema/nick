/**
 * Navigation root route.
 * @module routes/navroot/navroot
 */

import type { Request } from '../../types';
import type { Knex } from 'knex';

export const handler = async (req: Request, trx: Knex.Transaction) => {
  await req.navroot.fetchRelated('[_children(order)._type, _type]', trx);
  await req.navroot.fetchRelationLists(trx);

  return {
    json: await req.navroot.toJson(req),
  };
};

export default [
  {
    op: 'get',
    view: '/@navroot',
    permission: 'View',
    client: 'getNavroot',
    handler,
  },
];
