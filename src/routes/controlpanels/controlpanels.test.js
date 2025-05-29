import app from '../../app';
import { testRequest } from '../../helpers';

describe('Controlpanels', () => {
  it('should return the controlpanels', () =>
    testRequest(app, 'controlpanels/list'));

  it('should return a controlpanel', () =>
    testRequest(app, 'controlpanels/get'));

  it('should return the types controlpanel', () =>
    testRequest(app, 'controlpanels/get_types'));

  it('should add a type in the types controlpanel', () =>
    testRequest(app, 'controlpanels/post_types'));

  it('should update a controlpanel', () =>
    testRequest(app, 'controlpanels/patch'));
});
