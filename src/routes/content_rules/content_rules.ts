/**
 * Content rules routes.
 * @module routes/content_rules/content_rules
 */

import slugify from 'slugify';
import { omit } from 'es-toolkit/compat';
import models from '../../models';
import { RequestException } from '../../helpers/error/error';
import { apiLimiter } from '../../helpers/limiter/limiter';
import { translateSchema } from '../../helpers/schema/schema';
import { stripI18n } from '../../helpers/i18n/i18n';
import { getUrl } from '../../helpers/url/url';
import { uniqueId } from '../../helpers/utils/utils';
import contentRules from '../../content_rules';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export default [
  {
    op: 'get',
    view: '/@controlpanels/content-rules/:rule/action/:action',
    permission: 'Manage Site',
    client: 'getControlpanelContentRuleAction',
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(
        req.params.rule,
        {},
        trx,
      );
      if (
        !content_rule ||
        !content_rule.json.actions[parseInt(req.params.action, 10)]
      ) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: {
          '@id': `${getUrl(req)}/@controlpanels/content-rules/${req.params.rule}/action/${req.params.action}`,
          '@schema': translateSchema(
            stripI18n(
              contentRules.getAction(
                content_rule.json.actions[parseInt(req.params.action, 10)].type,
              ).schema,
            ),
            req,
          ),
          ...omit(
            content_rule.json.actions[parseInt(req.params.action, 10)],
            'type',
          ),
        },
      };
    },
  },
  {
    op: 'get',
    view: '/@controlpanels/content-rules/:rule/condition/:condition',
    permission: 'Manage Site',
    client: 'getControlpanelContentRuleCondition',
    cache: 'manage',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(
        req.params.rule,
        {},
        trx,
      );
      if (
        !content_rule ||
        !content_rule.json.conditions[parseInt(req.params.condition, 10)]
      ) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      return {
        json: {
          '@id': `${getUrl(req)}/@controlpanels/content-rules/${req.params.rule}/condition/${req.params.condition}`,
          '@schema': translateSchema(
            stripI18n(
              contentRules.getCondition(
                content_rule.json.conditions[parseInt(req.params.condition, 10)]
                  .type,
              ).schema,
            ),
            req,
          ),
          ...omit(
            content_rule.json.conditions[parseInt(req.params.condition, 10)],
            'type',
          ),
        },
      };
    },
  },
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
      const content_rules = await ContentRule.fetchAll(
        {},
        { order: 'title' },
        trx,
      );
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
    op: 'post',
    view: '/@controlpanels/content-rules/:id/action',
    permission: 'Manage Site',
    client: 'createControlpanelContentRuleAction',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(req.params.id, {}, trx);
      if (!content_rule) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      const updated_content_rule = await ContentRule.update(
        req.params.id,
        {
          json: {
            ...content_rule.json,
            actions: [...content_rule.json.actions, req.body],
          },
        },
        trx,
      );

      // Send created
      return {
        status: 201,
        json: await updated_content_rule.toJson(req, true),
      };
    },
  },
  {
    op: 'post',
    view: '/@controlpanels/content-rules/:id/condition',
    permission: 'Manage Site',
    client: 'createControlpanelContentRuleCondition',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(req.params.id, {}, trx);
      if (!content_rule) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      const updated_content_rule = await ContentRule.update(
        req.params.id,
        {
          json: {
            ...content_rule.json,
            conditions: [...content_rule.json.conditions, req.body],
          },
        },
        trx,
      );

      // Send created
      return {
        status: 201,
        json: await updated_content_rule.toJson(req, true),
      };
    },
  },
  {
    op: 'patch',
    view: '/@controlpanels/content-rules/:rule/action/:action',
    permission: 'Manage Site',
    client: 'updateControlpanelContentRuleAction',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const actionIndex = parseInt(req.params.action, 10);
      const content_rule = await ContentRule.fetchById(
        req.params.rule,
        {},
        trx,
      );
      if (!content_rule || !content_rule.json.actions[actionIndex]) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      const actions = [...content_rule.json.actions];
      if (req.body['form.button.Move']) {
        const newIndex =
          actionIndex + (req.body['form.button.Move'] === '_move_up' ? -1 : 1);
        if (newIndex < 0 || newIndex >= actions.length) {
          throw new RequestException(400, { error: req.i18n('Invalid move.') });
        }
        actions[actionIndex] = actions.splice(
          newIndex,
          1,
          actions[actionIndex],
        )[0];
      } else {
        actions[actionIndex] = {
          type: actions[actionIndex].type,
          ...omit(req.body, ['@id', '@schema']),
        };
      }
      await ContentRule.update(
        req.params.rule,
        {
          json: {
            ...content_rule.json,
            actions,
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
    op: 'patch',
    view: '/@controlpanels/content-rules/:rule/condition/:condition',
    permission: 'Manage Site',
    client: 'updateControlpanelContentRuleCondition',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const conditionIndex = parseInt(req.params.condition, 10);
      const content_rule = await ContentRule.fetchById(
        req.params.rule,
        {},
        trx,
      );
      if (!content_rule || !content_rule.json.conditions[conditionIndex]) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      const conditions = [...content_rule.json.conditions];
      if (req.body['form.button.Move']) {
        const newIndex =
          conditionIndex +
          (req.body['form.button.Move'] === '_move_up' ? -1 : 1);
        if (newIndex < 0 || newIndex >= conditions.length) {
          throw new RequestException(400, { error: req.i18n('Invalid move.') });
        }
        conditions[conditionIndex] = conditions.splice(
          newIndex,
          1,
          conditions[conditionIndex],
        )[0];
      } else {
        conditions[conditionIndex] = {
          type: conditions[conditionIndex].type,
          ...omit(req.body, ['@id', '@schema']),
        };
      }
      await ContentRule.update(
        req.params.rule,
        {
          json: {
            ...content_rule.json,
            conditions,
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
    view: '/@controlpanels/content-rules/:rule/action/:action',
    permission: 'Manage Site',
    client: 'deleteControlpanelContentRuleAction',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(
        req.params.rule,
        {},
        trx,
      );
      if (
        !content_rule ||
        !content_rule.json.actions[parseInt(req.params.action, 10)]
      ) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      const actions = [...content_rule.json.actions];
      actions.splice(parseInt(req.params.action, 10), 1);
      await ContentRule.update(
        req.params.rule,
        {
          json: {
            ...content_rule.json,
            actions,
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
    view: '/@controlpanels/content-rules/:rule/condition/:condition',
    permission: 'Manage Site',
    client: 'deleteControlpanelContentRuleCondition',
    cache: 'alter',
    handler: async (req: Request, trx: Knex.Transaction) => {
      const ContentRule = models.get('ContentRule');
      const content_rule = await ContentRule.fetchById(
        req.params.rule,
        {},
        trx,
      );
      if (
        !content_rule ||
        !content_rule.json.conditions[parseInt(req.params.condition, 10)]
      ) {
        throw new RequestException(404, { error: req.i18n('Not found.') });
      }
      const conditions = [...content_rule.json.conditions];
      conditions.splice(parseInt(req.params.condition, 10), 1);
      await ContentRule.update(
        req.params.rule,
        {
          json: {
            ...content_rule.json,
            conditions,
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
