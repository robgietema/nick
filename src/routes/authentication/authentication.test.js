import jwt from 'jsonwebtoken';

import app from '../../app';
import { testRequest } from '../../helpers';

jest.mock('jsonwebtoken');
jwt.sign.mockReturnValue(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzNjE3NDIsImV4cCI6MTY0OTQwNDk0Mn0.SBqYCkWsHNHqzTUPIGC1c1Zd9iDARmqDecb3k7Ok7vE',
);

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
