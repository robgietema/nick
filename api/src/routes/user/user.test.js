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
  it('should return an error on invalid user', () =>
    request(app)
      .get('/@users/nonexisting')
      .set('Authorization', getAdminHeader())
      .expect(404));
  it('should get a list of users', () =>
    request(app)
      .get('/@users')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body.length).toBe(2),
          expect(res.body[0].id).toBe('admin'),
        ]),
      ));
  it('should get a list of users by query', () =>
    request(app)
      .get('/@users?query=admin')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body.length).toBe(1),
          expect(res.body[0].id).toBe('admin'),
        ]),
      ));
  it('should get an error when not logged in', () =>
    request(app).get('/@users/admin').expect(401));
});
