/**
 * Workflow routes.
 * @module routes/workflow/workflow
 */

import moment from 'moment';

import { hasPermission, RequestException } from '../../helpers';

export default [
  {
    op: 'post',
    view: '/@workflow/:transition',
    handler: async (req, trx) => {
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

      // Update document
      await req.document.update(
        {
          modified: modified,
          workflow_state: new_state,
          workflow_history: JSON.stringify(workflow_history),
        },
        trx,
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
    handler: async (req, trx) => {
      await req.type.fetchRelated('_workflow', trx);
      return {
        json: req.type._workflow.toJSON(req),
      };
    },
  },
];
