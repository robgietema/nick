import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';
import { getAdminHeader } from '../../helpers';

describe('History', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should return the navigation', () =>
    request(app)
      .get('/news/@history')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body.length).toBe(2),
          expect(res.body[0]['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news\/@history\/1/,
          ),
          expect(res.body[0].version).toBe(1),
          expect(res.body[1]['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news\/@history\/0/,
          ),
          expect(res.body[1].version).toBe(0),
        ]),
      ));
});
