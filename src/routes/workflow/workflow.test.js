import { v4 as uuid } from 'uuid';
import moment from 'moment';

import app from '../../app';
import { Document } from '../../models';
import { testRequest } from '../../helpers';
import * as url from '../../helpers/url/url';

// Mock moment
jest.mock('moment');
moment.utc.mockReturnValue({
  format: () => '2022-04-08T16:00:00.000Z',
});

// Mock uuid
jest.mock('uuid');
uuid.mockReturnValue('a95388f2-e4b3-4292-98aa-62656cbd5b9c');

// Mock get url
jest
  .spyOn(url, 'getUrl')
  .mockImplementation(
    (req) =>
      `http://localhost:8000${
        req.document.path === '/' ? '' : req.document.path
      }`,
  );

describe('Workflow', () => {
  afterEach(() =>
    Document.delete({
      id: 'my-news-item',
    }),
  );

  it('should return the workflow', () => {
    jest
      .spyOn(Document.prototype, 'getUrl')
      .mockReturnValue('http://localhost:8000/news');
    return testRequest(app, 'workflow/workflow_get');
  });

  it('should change a workflow state', async () => {
    jest
      .spyOn(Document.prototype, 'getUrl')
      .mockReturnValue('http://localhost:8000/news/my-news-item');
    await testRequest(app, 'content/content_post');
    return testRequest(app, 'workflow/workflow_post');
  });
});
