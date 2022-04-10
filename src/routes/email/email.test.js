import app from '../../app';
import { testRequest } from '../../helpers';

describe('Email', () => {
  it('should send an email', () => testRequest(app, 'mail/mail_post'));
});
