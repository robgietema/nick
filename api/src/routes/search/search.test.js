import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';
import { getAdminHeader } from '../../helpers';

describe('Content', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should return the navigation', () =>
    request(app)
      .get('/@search')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(/http:\/\/127.0.0.1:.*\/@search/),
          expect(res.body.items.length).toBe(4),
          expect(res.body.items[0]['@id']).toMatch(/http:\/\/127.0.0.1:.*\//),
          expect(res.body.items[0]['@type']).toBe('site'),
          expect(res.body.items[0].title).toBe('Welcome to Isometric'),
        ]),
      ));
});
