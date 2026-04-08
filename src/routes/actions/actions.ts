/**
 * Action route.
 * @module routes/actions/actions
 */

import models from '../../models';
import type { Knex } from 'knex';
import type { Request } from '../../types';

export const handler = async (req: Request, trx: Knex.Transaction) => {
  const Action = models.get('Action');
  const actions = await Action.fetchAll({}, { order: 'order' }, trx);
  return {
    json: await actions.toJson(req),
  };
};

export default [
  {
    op: 'get',
    view: '/@actions',
    permission: 'View',
    client: 'getActions',
    cache: 'content',
    handler,
  },
];
