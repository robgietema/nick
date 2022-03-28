/**
 * Workflow Model.
 * @module models/workflow/workflow
 */

import _, { includes } from 'lodash';
import { getUrl } from '../../helpers';
import { BaseModel } from '../../models';

/**
 * A model for Workflow.
 * @class Workflow
 * @extends BaseModel
 */
export class Workflow extends BaseModel {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    const current_state_id = req.document.get('workflow_state');
    const current_state = this.json.states[current_state_id];

    return {
      '@id': `${getUrl(req)}/@workflow`,
      history: [],
      state: {
        id: current_state_id,
        title: req.i18n(current_state.title),
      },
      transitions: _(this.json.transitions)
        .pickBy((transition) =>
          includes(req.permissions, transition.permission),
        )
        .pick(current_state.transitions)
        .mapValues('title')
        .toPairs()
        .map((transition) => ({
          '@id': `${getUrl(req)}/@workflow/${transition[0]}`,
          title: req.i18n(transition[1]),
        }))
        .value(),
    };
  }
}
