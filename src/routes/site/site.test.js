import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Site', () => {
  it('should get the site information', () => testRequest(app, 'site/get'));
});
