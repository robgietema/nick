/**
 * Groups route.
 * @module routes/groups/groups
 */

import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@groups',
    handler: (req, res) =>
      requirePermission('View', req, res, () => res.send([])),
  },
];
