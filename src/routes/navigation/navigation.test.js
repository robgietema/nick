import app from '../../app';
import { testRequest } from '../../helpers';

describe('Navigation', () => {
  it('should return the navigation', () =>
    testRequest(app, 'navigation/navigation_get'));
});
