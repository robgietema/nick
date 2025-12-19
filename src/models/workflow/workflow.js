/**
 * Workflow Model.
 * @module models/workflow/workflow
 */

import _, { flatten, includes, map } from 'lodash';
import { getUrl } from '../../helpers/url/url';
import { Model } from '../../models/_model/_model';

/**
 * A model for Workflow.
 * @class Workflow
 * @extends Model
 */
export class Workflow extends Model {
  /**
   * Returns JSON data.
   * @method toJSON
   * @param {Object} req Request object
   * @returns {Array} JSON object.
   */
  toJSON(req) {
    const current_state_id = req.document.workflow_state;
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

  /**
   * Get permissions by state and roles
   * @method getPermissions
   * @param {string} state Current workflow state
   * @param {Array} roles Array of roles
   * @returns {Array} Array of permissions.
   */
  getPermissions(state, roles) {
    return flatten(
      map(roles, (role) => this.json.states[state].permissions[role] || []),
    );
  }
}
