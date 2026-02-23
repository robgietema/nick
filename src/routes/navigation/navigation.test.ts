import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Navigation', () => {
  it('should return the navigation', () => testRequest(app, 'navigation/get'));
});
