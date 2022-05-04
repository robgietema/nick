/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

import { Controlpanel } from '../../models';

export default [
  {
    op: 'get',
    view: '/@controlpanels',
    permission: 'Manage Site',
    handler: async (req, trx) => {
      const controlpanels = await Controlpanel.fetchAll(
        {},
        { order: 'title' },
        trx,
      );
      return {
        json: controlpanels.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@controlpanels/:id',
    permission: 'Manage Site',
    handler: async (req, trx) => {
      const controlpanel = await Controlpanel.fetchById(req.params.id, {}, trx);
      if (!controlpanel) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: controlpanel.toJSON(req, true),
      };
    },
  },
  {
    op: 'patch',
    view: '/@controlpanels/:id',
    permission: 'Manage Site',
    handler: async (req, trx) => {
      const controlpanel = await Controlpanel.fetchById(req.params.id, {}, trx);
      await Controlpanel.update(
        req.params.id,
        {
          data: {
            ...controlpanel.data,
            ...req.body,
          },
        },
        trx,
      );

      // Send ok
      return {
        status: 204,
      };
    },
  },
];
