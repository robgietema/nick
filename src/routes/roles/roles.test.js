import app from '../../app';
import { testRequest } from '../../helpers';

describe('Roles', () => {
  it('should get a list of roles', () => testRequest(app, 'roles/get'));
});
