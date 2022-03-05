/**
 * Groups route.
 * @module routes/groups/groups
 */

import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@groups',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () => res.send([])),
  },
];
