/**
 * Content Rule Model.
 * @module models/content_rule/content_rule
 */

import { Model } from '../_model/_model';
import type { Json, Request } from '../../types';
import { getRootUrl } from '../../helpers/url/url';
import { add } from 'es-toolkit/compat';

/**
 * A model for Content Rule.
 * @class ContentRule
 * @extends Model
 */
export class ContentRule extends Model {
  /**
   * Returns JSON data.
   * @method toJson
   * @param {Request} req Request object.
   * @param {Boolean} extend Extend data
   * @returns {Json} JSON object.
   */
  toJson(req: Request, extend: boolean = false): Json {
    const self: any = this;
    return {
      '@id': `${getRootUrl(req)}/@controlpanels/content-rules/${self.id}`,
      id: self.id,
      title: self.title,
      description: self.description,
      assigned: false,
      enabled: self.enabled,
      trigger: self.event,
      ...(extend
        ? {
            actions: self.json.actions || [],
            conditions: self.json.conditions || [],
            cascading: self.json.cascading || false,
            stop: self.json.stop || false,
            event: self.event,
            addable_actions: [],
            addable_conditions: [],
            assignments: [],
          }
        : {}),
    } as Json;
  }
}
