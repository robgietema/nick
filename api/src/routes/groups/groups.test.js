import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';
import { getAdminHeader } from '../../helpers';

describe('Groups', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should return the groups', () =>
    request(app)
      .get('/@groups')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.length).toBe(1)])));
});
