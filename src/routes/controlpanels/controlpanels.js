/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

import { Controlpanel } from '../../models';
import { handleFiles, handleImages } from '../../helpers';

export default [
  {
    op: 'get',
    view: '/@controlpanels',
    permission: 'Manage Site',
    client: 'getControlpanels',
    handler: async (req, trx) => {
      const controlpanels = await Controlpanel.fetchAll(
        {},
        { order: 'title' },
        trx,
      );
      return {
        json: await controlpanels.toJSON(req),
      };
    },
  },
  {
    op: 'get',
    view: '/@controlpanels/:id',
    permission: 'Manage Site',
    client: 'getControlpanel',
    handler: async (req, trx) => {
      const controlpanel = await Controlpanel.fetchById(req.params.id, {}, trx);
      if (!controlpanel) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: await controlpanel.toJSON(req, true),
      };
    },
  },
  {
    op: 'patch',
    view: '/@controlpanels/:id',
    permission: 'Manage Site',
    client: 'updateControlpanel',
    handler: async (req, trx) => {
      // Make a copy
      let json = { ...req.body };

      const controlpanel = await Controlpanel.fetchById(req.params.id, {}, trx);

      // Handle images
      json = await handleFiles(json, controlpanel);
      json = await handleImages(json, controlpanel);

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
