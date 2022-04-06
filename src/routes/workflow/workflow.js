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

      const new_state =
        req.type._workflow.json.transitions[req.params.transition].new_state;
      const modified = moment.utc().format();

      await req.document.update(
        {
          modified: modified,
          workflow_state: new_state,
        },
        trx,
      );

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
