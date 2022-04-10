import app from '../../app';
import { testRequest } from '../../helpers';
import * as url from '../../helpers/url/url';

// Mock get url
jest
  .spyOn(url, 'getUrl')
  .mockImplementation(
    (req) =>
      `http://localhost:8000${
        req.document.path === '/' ? '' : req.document.path
      }`,
  );

describe('Querystring', () => {
  it('should return the querystring', () =>
    testRequest(app, 'querystring/querystring_get'));
});
