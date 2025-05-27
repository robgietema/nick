import { Request } from 'express';
import { getUrl, getRootUrl } from './url';

// Extend Express Request to include document property
interface RequestWithDocument extends Request {
  document: {
    path: string;
  };
  apiPath: string;
}

describe('Url', () => {
  it('should get the url of a document', () =>
    expect(
      getUrl({
        apiPath: 'http://localhost:8080',
        document: { path: '/news' },
      } as RequestWithDocument),
    ).toBe('http://localhost:8080/news'));

  it('should get the url of the root', () =>
    expect(
      getUrl({
        apiPath: 'http://localhost:8080',
        document: { path: '/' },
      } as RequestWithDocument),
    ).toBe('http://localhost:8080'));

  it('should get the root url', () =>
    expect(
      getRootUrl({
        apiPath: 'http://localhost:8080',
      } as RequestWithDocument),
    ).toBe('http://localhost:8080'));
});
