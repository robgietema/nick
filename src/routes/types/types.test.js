import app from '../../app';
import { testRequest } from '../../helpers';
import * as url from '../../helpers/url/url';

jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');

describe('Types', () => {
  it('should return a list of types', () =>
    testRequest(app, 'types/types_list'));

  it('should return a type', () => testRequest(app, 'types/types_get'));

  it('should return not found when type not found', () =>
    testRequest(app, 'types/types_get_notfound'));
});
