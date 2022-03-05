/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@controlpanels',
    handler: (context, permissions, roles, req, res) =>
      requirePermission('View', permissions, res, () => res.send([])),
  },
];
