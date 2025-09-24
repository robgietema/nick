import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Inherit', () => {
  it('should return the content item specified by the behavior', () =>
    testRequest(app, 'inherit/get'));
});
