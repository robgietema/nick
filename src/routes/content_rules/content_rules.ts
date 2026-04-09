/**
 * Content rules routes.
 * @module routes/content_rules/content_rules
 */

import slugify from 'slugify';
import models from '../../models';
import { RequestException } from '../../helpers/error/error';
import { apiLimiter } from '../../helpers/limiter/limiter';
import { getUrl } from '../../helpers/url/url';
import { uniqueId } from '../../helpers/utils/utils';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'get',
    view: '/@controlpanels/content-rules/:id',
    permission: 'Manage Site',
    client: 'getControlpanelContentRule',
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(req.params.id, {}, trx);
      if (!content_rule) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: await content_rule.toJson(req, true),
      };
    },
  },
  {
    op: 'get',
    view: '/@controlpanels/content-rules',
    permission: 'Manage Site',
    client: 'getControlpanelContentRules',
    middleware: apiLimiter,
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rules = await ContentRule.fetchAll({}, {}, trx);
      return {
        json: {
          '@id': `${getUrl(req)}/@controlpanels/content-rules`,
          group: 'Content',
          title: 'Content Rules',
          items: [await content_rules.toJson(req)],
        },
      };
    },
  },
  {
    op: 'post',
    view: '/@controlpanels/content-rules',
    permission: 'Manage Site',
    client: 'createControlpanelContentRule',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const blacklist = await ContentRule.fetchAll({}, {}, trx).then(
        (content_rules: any) =>
          content_rules.map((content_rule: any) => content_rule.id),
      );
      const content_rule = await ContentRule.create(
        {
          id: uniqueId(
            slugify(req.body.title, { lower: true, remove: /[*+~.()'"!:@?]/g }),
            blacklist,
          ),
          title: req.body.title,
          description: req.body.description || '',
          event: req.body.event,
          enabled: req.body.enabled || false,
          json: {
            cascading: req.body.cascading || false,
            stop: req.body.stop || false,
            actions: [],
            conditions: [],
          },
        },
        {},
        trx,
      );

      // Send created
      return {
        status: 201,
        json: await content_rule.toJson(req, true),
      };
    },
  },
  {
    op: 'patch',
    view: '/@controlpanels/content-rules/:id',
    permission: 'Manage Site',
    client: 'updateControlpanelContentRule',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(req.params.id, {}, trx);
      if (!content_rule) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      await ContentRule.update(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description || '',
          event: req.body.event,
          enabled: req.body.enabled || false,
          json: {
            ...content_rule.json,
            cascading:
              typeof req.body.cascading === 'boolean'
                ? req.body.cascading
                : content_rule.json.cascading,
            stop:
              typeof req.body.stop === 'boolean'
                ? req.body.stop
                : content_rule.json.stop,
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
  {
    op: 'delete',
    view: '/@controlpanels/content-rules/:id',
    permission: 'Manage Site',
    client: 'deleteControlpanelContentRule',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      await ContentRule.deleteById(req.params.id, trx);

      return {
        status: 204,
      };
    },
  },
];
