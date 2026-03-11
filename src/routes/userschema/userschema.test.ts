import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('User schema', () => {
  it('should get the user schema', () => testRequest(app, 'userschema/get'));

  it('should get the registration user schema', () =>
    testRequest(app, 'userschema/registration'));
});
