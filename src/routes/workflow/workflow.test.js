import app from '../../app';
import { testRequest } from '../../helpers';

describe('Workflow', () => {
  it('should return the workflow', () => testRequest(app, 'workflow/get'));

  it('should change a workflow state', async () => {
    await testRequest(app, 'content/post');
    return testRequest(app, 'workflow/post');
  });
});
