import app from '../../app';
import { testRequest } from '../../helpers';

describe('Breadcrumbs', () => {
  it('should return the breadcrumbs', () =>
    testRequest(app, 'breadcrumbs/get'));
});
