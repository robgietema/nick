import app from '../../app';
import { testRequest } from '../../helpers';
import { Document } from '../../models';
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

// Mock get url
jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');

describe('Navigation', () => {
  it('should return the navigation', () =>
    testRequest(app, 'navigation/navigation_get'));
});
