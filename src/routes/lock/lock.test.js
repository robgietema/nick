import { v4 as uuid } from 'uuid';
import moment from 'moment';

import app from '../../app';
import { Document } from '../../models';
import { testRequest } from '../../helpers';
import * as url from '../../helpers/url/url';
import * as lock from '../../helpers/lock/lock';

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

// Mock lockExpired
jest.spyOn(lock, 'lockExpired').mockReturnValue(false);
jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');
jest
  .spyOn(Document.prototype, 'getUrl')
  .mockReturnValue('http://localhost:8000/news/my-news-item');

describe('Locking', () => {
  beforeEach(async () => {
    await testRequest(app, 'content/content_post');
  });
  afterEach(async () => {
    await testRequest(app, 'content/content_delete');
  });

  it('should lock an item', () => testRequest(app, 'locking/locking_post'));

  it('should lock an item with options', () =>
    testRequest(app, 'locking/locking_post_options'));

  it('should delete a lock', async () => {
    await testRequest(app, 'locking/locking_post');
    return testRequest(app, 'locking/locking_delete');
  });

  it('should delete a lock with force', async () => {
    await testRequest(app, 'locking/locking_post');
    return testRequest(app, 'locking/locking_delete_force');
  });

  it('should refresh a lock', async () => {
    await testRequest(app, 'locking/locking_post');
    return testRequest(app, 'locking/locking_patch');
  });

  it('should get lock information', async () => {
    await testRequest(app, 'locking/locking_post');
    return testRequest(app, 'locking/locking_get');
  });

  it('should update a document which is locked', async () => {
    await testRequest(app, 'locking/locking_post');
    return testRequest(app, 'locking/locking_update');
  });
});
