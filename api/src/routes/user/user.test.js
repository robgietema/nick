import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';

import { getAdminHeader } from '../../helpers';

describe('User', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should get the specified user', () =>
    request(app)
      .get('/@users/admin')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/@users\/admin/,
          ),
          expect(res.body.fullname).toBe('Admin'),
          expect(res.body.id).toBe('admin'),
        ]),
      ));
});
