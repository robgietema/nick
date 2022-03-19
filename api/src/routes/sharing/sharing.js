/**
 * Sharing route.
 * @module routes/sharing/sharing
 */

import { requirePermission } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@sharing',
    handler: (req, res) =>
      requirePermission('View', req, res, () => res.send({})),
  },
];
