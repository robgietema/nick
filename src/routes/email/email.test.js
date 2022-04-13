import app from '../../app';
import { testRequest } from '../../helpers';

describe('Email', () => {
  it('should send an email', () => testRequest(app, 'mail/mail_post'));

  it('should send an email to the webmaster', () =>
    testRequest(app, 'mail/mail_post_webmaster'));

  it('should send an email to an user', () =>
    testRequest(app, 'mail/mail_post_user'));
});
