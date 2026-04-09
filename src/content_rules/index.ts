/**
 * A content rule registry.
 * @module content_rules
 */

import { copy_item } from './actions/copy_item';
import { delete_item } from './actions/delete_item';
import { logger } from './actions/logger';
import { move_item } from './actions/move_item';
import { send_email } from './actions/send_email';
import { transition_workflow } from './actions/transition_workflow';
import { version_item } from './actions/version_item';

import { content_type } from './conditions/content_type';
import { file_extension } from './conditions/file_extension';
import { user_group } from './conditions/user_group';
import { user_role } from './conditions/user_role';
import { workflow_state } from './conditions/workflow_state';

/**
 * A content rule registry.
 * @class ContentRules
 */
class ContentRules {
  public actions: any;
  public conditions: any;
  static instance: ContentRules;

  /**
   * Construct a Config.
   * @constructs Config
   */
  constructor() {
    this.actions = {};
    this.conditions = {};

    if (!ContentRules.instance) {
      ContentRules.instance = this;
    }

    return ContentRules.instance;
  }

  /**
   * Register an action rule.
   * @param {string} name The name of the action.
   * @param {any} rule The action to register.
   */
  registerAction(name: string, rule: any) {
    this.actions[name] = rule;
  }

  /**
   * Get an action rule.
   * @param {string} name The name of the action rule.
   * @returns {any} The action rule.
   */
  getAction(name: string): any {
    return this.actions[name]();
  }

  /**
   * Register a condition rule.
   * @param {string} name The name of the condition.
   * @param {any} rule The condition to register.
   */
  registerCondition(name: string, rule: any) {
    this.conditions[name] = rule;
  }

  /**
   * Get a condition rule.
   * @param {string} name The name of the condition rule.
   * @returns {any} The condition rule.
   */
  getCondition(name: string): any {
    return this.conditions[name]();
  }
}

// Create an instance of the ContentRules registry and register all content rules
const contentRules = new ContentRules();

contentRules.registerAction('copy_item', copy_item);
contentRules.registerAction('delete_item', delete_item);
contentRules.registerAction('logger', logger);
contentRules.registerAction('move_item', move_item);
contentRules.registerAction('send_email', send_email);
contentRules.registerAction('transition_workflow', transition_workflow);
contentRules.registerAction('version_item', version_item);

contentRules.registerCondition('content_type', content_type);
contentRules.registerCondition('file_extension', file_extension);
contentRules.registerCondition('user_group', user_group);
contentRules.registerCondition('user_role', user_role);
contentRules.registerCondition('workflow_state', workflow_state);

// Export the instance and all content rules
export default contentRules;
