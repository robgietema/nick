import app from '../../app';
import { testRequest } from '../../helpers';

describe('Types', () => {
  it('should return a list of types', () =>
    testRequest(app, 'types/types_list'));

  it('should return a type', () => testRequest(app, 'types/types_get'));

  it('should return not found when type not found', () =>
    testRequest(app, 'types/types_get_notfound'));

  it('should return a list of types in a different language', () =>
    testRequest(app, 'types/types_list_i18n'));
});
