import app from '../../app';
import { testRequest } from '../../helpers';
import * as lock from '../../helpers/lock/lock';

// Mock lockExpired
jest.spyOn(lock, 'lockExpired').mockReturnValue(false);

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
