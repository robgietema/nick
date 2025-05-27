/**
 * Action route.
 * @module routes/actions/actions
 */

import { Action } from '../../models';

export const handler = async (req, trx) => {
  const actions = await Action.fetchAll({}, { order: 'order' }, trx);
  return {
    json: actions.toJSON(req),
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
