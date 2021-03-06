import app from '../../app';
import { testRequest } from '../../helpers';

describe('Controlpanels', () => {
  it('should return the controlpanels', () =>
    testRequest(app, 'controlpanels/list'));

  it('should return a controlpanel', () =>
    testRequest(app, 'controlpanels/get'));

  it('should update a controlpanel', () =>
    testRequest(app, 'controlpanels/patch'));
});
