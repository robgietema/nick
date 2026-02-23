/**
 * Workflow routes.
 * @module routes/workflow/workflow
 */

import moment from 'moment';

import config from '../../helpers/config/config';

import { hasPermission } from '../../helpers/auth/auth';
import { RequestException } from '../../helpers/error/error';
import type { Request } from '../../types';
import type { Knex } from 'knex';

export const handler = async (req: Request, trx: Knex.Transaction) => {
  await req.type.fetchRelated('_workflow', trx);
  return {
    json: req.type._workflow.toJson(req),
  };
};

export default [
  {
    op: 'post',
    view: '/@workflow/:transition',
    client: 'changeWorkflow',
    handler: async (req: Request, trx: Knex.Transaction) => {
      await req.type.fetchRelated('_workflow', trx);

      // Check permission
      if (
        !hasPermission(
          req.permissions,
          req.type._workflow.json.transitions[req.params.transition].permission,
        )
      ) {
        throw new RequestException(401, {
          message: req.i18n(
            'You are not authorization to access this resource.',
          ),
        });
      }

      // Get new state and modified timestamp
      const new_state =
        req.type._workflow.json.transitions[req.params.transition].new_state;
      const old_state = req.document.workflow_state;
      const modified = moment.utc().format();

      // Add to workflow history
      const workflow_history = req.document.workflow_history;
      workflow_history.push({
        time: modified,
        actor: req.user.id,
        action: req.params.transition,
        state_title: req.type._workflow.json.states[new_state].title,
        review_state: new_state,
        transition_title:
          req.type._workflow.json.transitions[req.params.transition].title,
      });

      // Trigger on before change workflow
      await config.settings.events.trigger(
        'onBeforeChangeWorkflow',
        req.document,
        trx,
        req.params.transition,
        new_state,
      );

      // Update document
      await req.document.update(
        {
          modified: modified,
          workflow_state: new_state,
          workflow_history: JSON.stringify(workflow_history),
        },
        trx,
      );

      // Reindex document
      await req.document.reindex(trx);

      // Trigger on after change workflow
      await config.settings.events.trigger(
        'onAfterChangeWorkflow',
        req.document,
        trx,
        req.params.transition,
        old_state,
      );

      // Return workflow state
      return {
        json: {
          action: req.params.transition,
          actor: req.user.id,
          comments: '',
          review_state: new_state,
          time: modified,
          title: req.type._workflow.json.states[new_state].title,
        },
      };
    },
  },
  {
    op: 'get',
    view: '/@workflow',
    permission: 'View',
    client: 'getWorkflow',
    handler,
  },
];
