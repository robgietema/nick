import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Breadcrumbs', () => {
  it('should return the breadcrumbs', () =>
    testRequest(app, 'breadcrumbs/get'));
});
