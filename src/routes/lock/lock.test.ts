import { describe, beforeEach, afterEach, it, vi } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';
import * as lock from '../../helpers/lock/lock';

// Mock lockExpired
vi.spyOn(lock, 'lockExpired').mockReturnValue(false);

describe('Locking', () => {
  beforeEach(async () => {
    await testRequest(app, 'content/post');
  });
  afterEach(async () => {
    await testRequest(app, 'content/delete');
  });

  it('should lock an item', () => testRequest(app, 'locking/post'));

  it('should lock an item with options', () =>
    testRequest(app, 'locking/post_options'));

  it('should delete a lock', async () => {
    await testRequest(app, 'locking/post');
    return testRequest(app, 'locking/delete');
  });

  it('should delete a lock with force', async () => {
    await testRequest(app, 'locking/post');
    return testRequest(app, 'locking/delete_force');
  });

  it('should refresh a lock', async () => {
    await testRequest(app, 'locking/post');
    return testRequest(app, 'locking/patch');
  });

  it('should get lock information', async () => {
    await testRequest(app, 'locking/post');
    return testRequest(app, 'locking/get');
  });

  it('should update a document which is locked', async () => {
    await testRequest(app, 'locking/post');
    return testRequest(app, 'locking/update');
  });
});
