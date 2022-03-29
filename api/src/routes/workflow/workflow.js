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
      const workflow = await Workflow.findById(req.type.workflow);

      requirePermission(
        workflow.json.transitions[req.params.transition].permission,
        req,
        res,
        async () => {
          const new_state =
            workflow.json.transitions[req.params.transition].new_state;
          const modified = moment.utc().format();

          await req.document.save(
            {
              modified: modified,
              workflow_state: new_state,
            },
            { patch: true },
          );

          res.send({
            action: req.params.transition,
            actor: req.user.id,
            comments: '',
            review_state: new_state,
            time: modified,
            title: workflow.json.states[new_state].title,
          });
        },
      );
    },
  },
  {
    op: 'get',
    view: '/@workflow',
    handler: (req, res) =>
      requirePermission('View', req, res, async () => {
        const workflow = await Workflow.findById(req.type.workflow);
        res.send(workflow.toJSON(req));
      }),
  },
];
