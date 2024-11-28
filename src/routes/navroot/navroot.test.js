import app from '../../app';
import { testRequest } from '../../helpers';

describe('Navroot', () => {
  it('should get the navroot', () => testRequest(app, 'navroot/get'));
});
