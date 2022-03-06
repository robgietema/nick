import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';
import { DocumentRepository } from '../../repositories';
import { getAdminHeader } from '../../helpers';

describe('Content', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should return the navigation', () =>
    request(app)
      .get('/news/@navigation')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news\/@navigation/,
          ),
          expect(res.body.items.length).toBe(3),
          expect(res.body.items[0]['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news/,
          ),
          expect(res.body.items[0]['@type']).toBe('folder'),
          expect(res.body.items[0].title).toBe('News'),
          expect(res.body.items[0].id).toBe('news'),
        ]),
      ));
});
