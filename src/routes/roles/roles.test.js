import app from '../../app';
import * as url from '../../helpers/url/url';
import { testRequest } from '../../helpers';

jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');

describe('Roles', () => {
  it('should get a list of roles', () => testRequest(app, 'roles/roles_get'));
});
