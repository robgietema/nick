import app from '../../app';
import { testRequest } from '../../helpers';

describe('Sharing', () => {
  it('should get sharing information', () =>
    testRequest(app, 'sharing/sharing_get'));

  it('should get sharing information with search', () =>
    testRequest(app, 'sharing/sharing_get_search'));

  it('should set new sharing information', () =>
    testRequest(app, 'sharing/sharing_post'));
});
