/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@controlpanels',
    handler: (req, res) =>
      requirePermission('View', req, res, () => res.send([])),
  },
];
