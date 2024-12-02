import { getUrl, getRootUrl } from './url';

describe('Url', () => {
  it('should get the url of a document', () =>
    expect(
      getUrl({
        protocol: 'http',
        headers: { host: 'localhost:8080' },
        document: { path: '/news' },
      }),
    ).toBe('http://localhost:8080/news'));

  it('should get the url of the root', () =>
    expect(
      getUrl({
        protocol: 'http',
        headers: { host: 'localhost:8080' },
        document: { path: '/' },
      }),
    ).toBe('http://localhost:8080'));

  it('should get the root url', () =>
    expect(
      getRootUrl({
        protocol: 'http',
        headers: { host: 'localhost:8080' },
      }),
    ).toBe('http://localhost:8080'));
});
