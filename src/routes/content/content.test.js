import { v4 as uuid } from 'uuid';

import app from '../../app';
import { testRequest } from '../../helpers';

describe('Content', () => {
  it('should return a content object', () =>
    testRequest(app, 'content/content_get'));

  it('should add a content object', () =>
    testRequest(app, 'content/content_post'));

  it('should update a content object', async () => {
    await testRequest(app, 'content/content_post');
    return testRequest(app, 'content/content_patch');
  });

  it('should delete a content object', async () => {
    await testRequest(app, 'content/content_post');
    return testRequest(app, 'content/content_delete');
  });

  it('should return not found when content not found', () =>
    testRequest(app, 'content/content_get_notfound'));

  it('should return bad request when required field is missing', () =>
    testRequest(app, 'content/content_post_badrequest'));

  it('should be able to handle reordering of content', async () => {
    await testRequest(app, 'content/content_post');
    return testRequest(app, 'content/content_patch_reorder');
  });

  it('should copy a content object', () =>
    testRequest(app, 'copymove/copymove_copy'));

  it('should move a content object', () =>
    testRequest(app, 'copymove/copymove_move'));

  it('should copy multiple content objects', () => {
    // Mock uuid
    let i = 0;
    jest.mock('uuid');
    uuid.mockImplementation(() => {
      i = i + 1;
      return `a95388f2-e4b3-4292-98aa-62656cbd5b9${i}`;
    });

    return testRequest(app, 'copymove/copymove_copy_multiple');
  });
});
