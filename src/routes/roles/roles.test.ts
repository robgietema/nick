import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Roles', () => {
  it('should get a list of roles', () => testRequest(app, 'roles/get'));
});
