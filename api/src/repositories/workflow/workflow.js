/**
 * Workflow Repository.
 * @module repositories/workflow/workflow
 */

import { Workflow } from '../../models';
import { BaseRepository } from '../../helpers';

/**
 * A Repository for Workflow.
 * @class WorkflowRepository
 * @extends BaseRepository
 */
export class WorkflowRepository extends BaseRepository {
  /**
   * Construct a WorkflowRepository for Workflow.
   * @constructs WorkflowRepository
   */
  constructor() {
    super(Workflow);
  }
}

export const workflowRepository = new WorkflowRepository();
