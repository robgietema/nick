import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';
import { getAdminHeader } from '../../helpers';

describe('Roles', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should return the roles', () =>
    request(app)
      .get('/@roles')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body.length).toBe(7),
          expect(res.body[0]['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/@roles\/Anonymous/,
          ),
          expect(res.body[0]['@type']).toBe('role'),
          expect(res.body[0].id).toBe('Anonymous'),
          expect(res.body[0].title).toBe('Anonymous'),
        ]),
      ));
});
