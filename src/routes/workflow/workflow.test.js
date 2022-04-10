import app from '../../app';
import { testRequest } from '../../helpers';

describe('Workflow', () => {
  it('should return the workflow', () =>
    testRequest(app, 'workflow/workflow_get'));

  it('should change a workflow state', async () => {
    await testRequest(app, 'content/content_post');
    return testRequest(app, 'workflow/workflow_post');
  });
});
