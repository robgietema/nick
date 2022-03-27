/**
 * Action route.
 * @module routes/actions/actions
 */

import { actionRepository } from '../../repositories';
import { requirePermission } from '../../helpers';
import { Action } from '../../models';

export default [
  {
    op: 'get',
    view: '/@actions',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const actions = await Action.findAll({}, { order: 'order' });
        res.send(actions.toJSON(req));
      }),
  },
];
