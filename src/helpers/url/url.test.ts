import { describe, it, expect } from 'vitest';
import { getUrl, getRootUrl } from './url';
import type { Request } from '../../types';

describe('Url', () => {
  it('should get the url of a document', () =>
    expect(
      getUrl({
        apiPath: 'http://localhost:8080',
        document: { path: '/news' },
      } as Request),
    ).toBe('http://localhost:8080/news'));

  it('should get the url of the root', () =>
    expect(
      getUrl({
        apiPath: 'http://localhost:8080',
        document: { path: '/' },
      } as Request),
    ).toBe('http://localhost:8080'));

  it('should get the root url', () =>
    expect(
      getRootUrl({
        apiPath: 'http://localhost:8080',
      } as Request),
    ).toBe('http://localhost:8080'));
});
