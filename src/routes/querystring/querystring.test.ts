import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Querystring', () => {
  it('should return the querystring', () =>
    testRequest(app, 'querystring/get'));
});
