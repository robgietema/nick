/**
 * Action route.
 * @module routes/actions/actions
 */

import { Action } from '../../models/action/action';

export const handler = async (req, trx) => {
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
