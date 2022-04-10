import app from '../../app';
import { testRequest } from '../../helpers';

describe('History', () => {
  it('should return the history', () =>
    testRequest(app, 'history/history_get'));

  it('should return a content object of a specific version', () =>
    testRequest(app, 'history/history_get_version'));

  it('should revert to a specific version', async () => {
    await testRequest(app, 'content/content_post');
    await testRequest(app, 'content/content_patch');
    return testRequest(app, 'history/history_patch');
  });
});
