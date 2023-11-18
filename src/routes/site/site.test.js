import app from '../../app';
import { testRequest } from '../../helpers';

describe('Site', () => {
  it('should get the site information', () => testRequest(app, 'site/get'));
});
