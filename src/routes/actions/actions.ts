/**
 * Action route.
 * @module routes/actions/actions
 */

import { Action } from '../../models/action/action';
import type { Knex } from 'knex';
import type { Request } from '../../types';

export const handler = async (req: Request, trx: Knex.Transaction) => {
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
    handler,
  },
];
