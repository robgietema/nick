import app from '../../app';
import { testRequest } from '../../helpers';

describe('Authentication', () => {
  it('should handle login', () =>
    testRequest(app, 'Authentication/login_post_valid'));

  it('should fail on incorrect credentials', () =>
    testRequest(app, 'Authentication/login_post_incorrect'));

  it('should fail on invalid user', () =>
    testRequest(app, 'Authentication/login_post_invalid'));

  it('should fail on missing credentials', () =>
    testRequest(app, 'Authentication/login_post_missing'));

  it('should handle login-renew with a valid user', () =>
    testRequest(app, 'Authentication/login_renew_post_valid'));

  it('should handle login-renew with an invalid user', () =>
    testRequest(app, 'Authentication/login_renew_post_invalid'));

  it('should handle logout', () =>
    testRequest(app, 'Authentication/logout_post'));
});
