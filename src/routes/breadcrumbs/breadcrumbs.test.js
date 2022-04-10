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

// Mock get root url
jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');

describe('Breadcrumbs', () => {
  it('should return the breadcrumbs', () =>
    testRequest(app, 'breadcrumbs/breadcrumbs_get'));
});
