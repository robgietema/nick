import app from '../../app';
import { testRequest } from '../../helpers';

describe('User', () => {
  afterEach(async () => {
    await testRequest(app, 'users/users_delete');
  });

  it('should get a list of users', () => testRequest(app, 'users/users_list'));

  it('should get a list of users by query', () =>
    testRequest(app, 'users/users_list_query'));

  it('should get an error when not logged in', () =>
    testRequest(app, 'users/users_list_anonymous'));

  it('should get an individual user', () =>
    testRequest(app, 'users/users_get'));

  it('should not get a user when not logged in', () =>
    testRequest(app, 'users/users_get_anonymous'));

  it('should not get a user when not found', () =>
    testRequest(app, 'users/users_get_notfound'));

  it('should add a new user', () => testRequest(app, 'users/users_post'));

  it('should update a user', async () => {
    await testRequest(app, 'users/users_post');
    return testRequest(app, 'users/users_patch');
  });

  it('should delete a user', async () => {
    await testRequest(app, 'users/users_post');
    return testRequest(app, 'users/users_delete');
  });

  it('should send a reset password mail', async () => {
    await testRequest(app, 'users/users_post');
    return testRequest(app, 'users/users_reset_password_mail');
  });

  it('should reset a password', async () => {
    await testRequest(app, 'users/users_post');
    return testRequest(app, 'users/users_reset_password_set');
  });

  it('should set own password', async () => {
    await testRequest(app, 'users/users_post');
    return testRequest(app, 'users/users_reset_password_own');
  });
});
