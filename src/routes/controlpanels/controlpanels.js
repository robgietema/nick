/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

import { without } from 'es-toolkit/array';
import { mapKeys, merge, omit, pick } from 'es-toolkit/object';

import { Controlpanel } from '../../models/controlpanel/controlpanel';
import { Document } from '../../models/document/document';
import { Type } from '../../models/type/type';
import { Workflow } from '../../models/workflow/workflow';

import { getUrl } from '../../helpers/url/url';
import { RequestException } from '../../helpers/error/error';
import { handleFiles, handleImages } from '../../helpers/content/content';

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
    op: 'post',
    view: '/@controlpanels/dexterity-types',
    permission: 'Manage Site',
    client: 'createControlpanelType',
    handler: async (req, trx) => {
      // Check if type exists
      const workflows = await Workflow.fetchAll({}, {}, trx);
      const current = await Type.fetchById(req.body.title, {}, trx);
      let typeModel;

      // If doesn't exist
      if (!current) {
        typeModel = await Type.create(
          {
            id: req.body.title,
            global_allow: true,
            allowed_content_types: [],
            filter_content_types: false,
            schema: {
              fieldsets: [],
              properties: {},
              required: [],
              behaviors: [],
              layouts: [],
            },
            workflow: workflows.models[0].id,
            ...req.body,
          },
          {},
          trx,
        );
      } else {
        typeModel = await Type.update(
          req.body.title,
          merge(current.$toDatabaseJson(), req.body),
          trx,
        );
      }

      await typeModel.cacheSchema(trx);

      // Return success
      return {
        status: 201,
        json: await typeModel.toControlPanelJSON(req, trx),
      };
    },
  },
  {
    op: 'delete',
    view: '/@controlpanels/dexterity-types/:id',
    permission: 'Manage Site',
    client: 'deleteControlpanelType',
    handler: async (req, trx) => {
      await Type.deleteById(req.params.id, trx);

      // Return deleted
      return {
        status: 204,
      };
    },
  },
  {
    op: 'get',
    view: '/@controlpanels/dexterity-types/:id',
    permission: 'Manage Site',
    client: 'getControlpanelType',
    handler: async (req, trx) => {
      const type = await Type.fetchById(req.params.id, {}, trx);

      // Return success
      return {
        json: await type.toControlPanelJSON(req, trx),
      };
    },
  },
  {
    op: 'patch',
    view: '/@controlpanels/dexterity-types/:id',
    permission: 'Manage Site',
    client: 'updateControlpanel',
    handler: async (req, trx) => {
      const fields = [
        'title',
        'description',
        'allowed_content_types',
        'filter_content_types',
      ];

      // Fetch type
      let type = await Type.fetchById(req.params.id, {}, trx);

      // Calc behaviors
      let behaviors = type.schema.behaviors;
      mapKeys(omit(req.body, fields), (enabled, behavior) => {
        if (enabled) {
          behaviors.push(behavior);
        } else {
          behaviors = without(behaviors, behavior);
        }
      });

      // Update type
      type = await Type.update(
        req.params.id,
        {
          ...pick(req.body, fields),
          schema: {
            ...type.schema,
            behaviors,
          },
        },
        trx,
      );

      // Chache schema
      await type.cacheSchema(trx);

      // Send ok
      return {
        status: 204,
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
            ...json,
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
