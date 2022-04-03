/**
 * Workflow routes.
 * @module routes/workflow/workflow
 */

import moment from 'moment';

import { requirePermission } from '../../helpers';
import { Workflow } from '../../models';

export default [
  {
    op: 'post',
    view: '/@workflow/:transition',
    handler: async (req, res) => {
      await req.type.fetchRelated('_workflow');

      requirePermission(
        req.type._workflow.json.transitions[req.params.transition].permission,
        req,
        res,
        async () => {
          const new_state =
            req.type._workflow.json.transitions[req.params.transition]
              .new_state;
          const modified = moment.utc().format();

          await req.document.update({
            modified: modified,
            workflow_state: new_state,
          });

          res.send({
            action: req.params.transition,
            actor: req.user.id,
            comments: '',
            review_state: new_state,
            time: modified,
            title: req.type._workflow.json.states[new_state].title,
          });
        },
      );
    },
  },
  {
    op: 'get',
    view: '/@workflow',
    permission: 'View',
    handler: async (req, res) => {
      await req.type.fetchRelated('_workflow');
      res.send(req.type._workflow.toJSON(req));
    },
  },
];
