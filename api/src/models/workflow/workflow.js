/**
 * Type Workflow.
 * @module models/workflow/workflow
 */

import { BaseModel } from '../../helpers';

export const Workflow = BaseModel.extend({
  tableName: 'workflow',
  idAttribute: 'id',
});
