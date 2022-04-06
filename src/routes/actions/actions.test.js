import request from 'supertest';

import app from '../../app';

import { getAdminHeader } from '../../helpers';

describe('Actions', () => {
  it('should get actions', () =>
    request(app)
      .get('/@actions')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => expect(res.body.object).toBeDefined()));
});
