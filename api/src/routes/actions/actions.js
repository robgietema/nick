/**
 * Action route.
 * @module routes/actions/actions
 */

import { actionRepository } from '../../repositories';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@actions',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const actions = await actionRepository.findAll({}, 'order');
        const result = {};
        actions.map((action) => {
          if (req.permissions.indexOf(action.get('permission')) !== -1) {
            const category = action.get('category');
            if (category in result === false) {
              result[category] = [];
            }
            result[category].push({
              id: action.get('id'),
              title: action.get('title'),
            });
          }
          return true;
        });
        res.send(result);
      }),
  },
];
