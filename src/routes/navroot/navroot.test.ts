import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Navroot', () => {
  it('should get the navroot', () => testRequest(app, 'navroot/get'));
});
