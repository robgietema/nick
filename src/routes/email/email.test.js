import app from '../../app';
import { testRequest } from '../../helpers';

describe('Email', () => {
  it('should send an email', () => testRequest(app, 'mail/post'));

  it('should send an email to the webmaster', () =>
    testRequest(app, 'mail/post_webmaster'));

  it('should send an email to an user', () =>
    testRequest(app, 'mail/post_user'));
});
