/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

import { Controlpanel, Document, Type } from '../../models';
import { getUrl, handleFiles, handleImages } from '../../helpers';
import { title } from 'process';

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
    // permission: 'Manage Site',
    client: 'getControlpanel',
    handler: async (req, trx) => {
      switch (req.params.id) {
        case 'dexterity-types':
          const types = await Type.fetchAll({}, {}, trx);
          const path = getUrl(req);
          const documents = await Document.buildQuery({}, {}, trx)
            .select('type')
            .count()
            .groupBy('type');
          const counts = {};
          documents.map((document) => {
            counts[document.type] = parseInt(document.count);
          });

          return {
            json: {
              '@id': `${path}/@controlpanels/dexterity-types`,
              items: types.map((type) => ({
                '@id': `${path}/@controlpanels/dexterity-types/${type.id}`,
                '@type': type.id,
                title: type.title,
                description: type.description,
                id: type.id,
                count: counts[type.id] || 0,
                meta_type: type.id,
              })),
              title: req.i18n('Content Types'),
              group: req.i18n('Content'),
            },
          };
        default:
          const controlpanel = await Controlpanel.fetchById(
            req.params.id,
            {},
            trx,
          );
          if (!controlpanel) {
            throw new RequestException(404, { error: req.i18n('Not found.') });
          }
          return {
            json: await controlpanel.toJSON(req, true),
          };
      }
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
