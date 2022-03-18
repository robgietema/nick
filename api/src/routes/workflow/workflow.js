/**
 * Workflow routes.
 * @module routes/workflow/workflow
 */

import moment from 'moment';
import { remove, map, toPairs } from 'lodash';
import { requirePermission } from '../../helpers';

export default [
  {
    op: 'post',
    view: '/@workflow/:transition',
    handler: (req, res) => {
      const json = req.type.related('workflow').get('json');

      requirePermission(
        json.transitions[req.params.transition].permission,
        req,
        res,
        async () => {
          const new_state = json.transitions[req.params.transition].new_state;
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
            actor: req.user.get('id'),
            comments: '',
            review_state: new_state,
            time: modified,
            title: json.states[new_state].title,
          });
        },
      );
    },
  },
  {
    op: 'get',
    view: '/@workflow',
    handler: (req, res) =>
      requirePermission('View', req, res, () => {
        const json = req.type.related('workflow').get('json');

        // Get transitions
        const transitions = toPairs(json.transitions);

        // Remove transitions without permissions
        remove(
          transitions,
          (transition) =>
            req.permissions.indexOf(transition[1].permission) === -1,
        );

        // Remove transitions not applicable for the current state
        remove(
          transitions,
          (transition) =>
            json.states[req.document.get('workflow_state')].transitions.indexOf(
              transition[0],
            ) === -1,
        );

        res.send({
          '@id': `${req.protocol || 'http'}://${
            req.headers.host
          }${req.document.get('path')}/@workflow`,
          history: [],
          state: {
            id: req.document.get('workflow_state'),
            title: req.type.related('workflow').get('json').states[
              req.document.get('workflow_state')
            ].title,
          },
          transitions: map(transitions, (item) => ({
            '@id': `${req.protocol || 'http'}://${
              req.headers.host
            }${req.document.get('path')}/@workflow/${item[0]}`,
            title: item[1].title,
          })),
        });
      }),
  },
];
