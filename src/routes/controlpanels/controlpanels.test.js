import app from '../../app';
import { testRequest } from '../../helpers';

describe('Controlpanels', () => {
  it('should return the controlpanels', () =>
    testRequest(app, 'controlpanels/get'));
});
