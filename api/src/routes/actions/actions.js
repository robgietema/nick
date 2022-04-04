/**
 * Action route.
 * @module routes/actions/actions
 */

import { Action } from '../../models';

export default [
  {
    op: 'get',
    view: '/@actions',
    permission: 'View',
    handler: async (req, res) => {
      const actions = await Action.fetchAll({}, { order: 'order' });
      return {
        json: actions.toJSON(req),
      };
    },
  },
];
