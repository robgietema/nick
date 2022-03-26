/**
 * Type Workflow.
 * @module models/workflow/workflow
 */

import { BookshelfModel } from '../../helpers';

export const Workflow = BookshelfModel.extend({
  tableName: 'workflow',
  idAttribute: 'id',
});
