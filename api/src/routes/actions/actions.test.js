import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';

import { getAdminHeader } from '../../helpers';

describe('Actions', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should get actions', () =>
    request(app)
      .get('/@actions')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => expect(res.body.object).toBeDefined()));
});
