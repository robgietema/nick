import app from '../../app';
import { testRequest } from '../../helpers';

describe('Actions', () => {
  it('should get actions as anonymous', () =>
    testRequest(app, 'actions/actions_get_anonymous'));

  it('should get actions as authenticated', () =>
    testRequest(app, 'actions/actions_get_authenticated'));
});
