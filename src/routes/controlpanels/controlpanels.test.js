import request from 'supertest';

import app from '../../app';
import { getAdminHeader } from '../../helpers';

describe('Controlpanels', () => {
  it('should return the controlpanels', () =>
    request(app)
      .get('/@controlpanels')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.length).toBe(0)])));
});
