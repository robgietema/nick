import app from '../../app';
import { testRequest } from '../../helpers';

describe('Querystring', () => {
  it('should return the querystring', () =>
    testRequest(app, 'querystring/querystring_get'));
});
