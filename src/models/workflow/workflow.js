/**
 * Workflow Model.
 * @module models/workflow/workflow
 */

import { flatten } from 'es-toolkit/array';
import { mapValues, pick, pickBy } from 'es-toolkit/object';

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
   * @method toJson
   * @param {Object} req Request object
   * @returns {Array} JSON object.
   */
  toJson(req) {
    const current_state_id = req.document.workflow_state;
    const current_state = this.json.states[current_state_id];

    return {
      '@id': `${getUrl(req)}/@workflow`,
      history: [],
      state: {
        id: current_state_id,
        title: req.i18n(current_state.title),
      },
      transitions: Object.entries(
        mapValues(
          pick(
            pickBy(this.json.transitions, (transition) =>
              req.permissions.includes(transition.permission),
            ),
            current_state.transitions,
          ),
          (item) => item.title,
        ),
      ).map((transition) => ({
        '@id': `${getUrl(req)}/@workflow/${transition[0]}`,
        title: req.i18n(transition[1]),
      })),
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
      roles.map((role) => this.json.states[state].permissions[role] || []),
    );
  }
}
