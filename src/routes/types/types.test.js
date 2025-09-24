import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Types', () => {
  it('should return a list of types', () => testRequest(app, 'types/list'));

  it('should return a type', () => testRequest(app, 'types/get'));

  it('should return not found when type not found', () =>
    testRequest(app, 'types/get_notfound'));

  it('should return a list of types in a different language', () =>
    testRequest(app, 'types/list_i18n'));
});
