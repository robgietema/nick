import { v4 as uuid } from 'uuid';
import moment from 'moment';

import app from '../../app';
import { Document } from '../../models';
import { testRequest } from '../../helpers';
import * as url from '../../helpers/url/url';

jest.mock('moment');
moment.utc.mockReturnValue({
  format: () => '2022-04-08T16:00:00.000Z',
});

jest.mock('uuid');
uuid.mockReturnValue('a95388f2-e4b3-4292-98aa-62656cbd5b9c');

// Mock get url
jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');

describe('Content', () => {
  afterEach(() =>
    Document.delete({
      id: 'my-news-item',
    }),
  );

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
});
