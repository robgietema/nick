import request from 'supertest';

import app from '../../app';
import bookshelf from '../../bookshelf';
import { getAdminHeader } from '../../helpers';

describe('Search', () => {
  afterAll(() => bookshelf.knex.destroy());

  it('should return all items', () =>
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
          expect(res.body.items[0].title).toBe('Welcome to Volto'),
        ]),
      ));
  it('should find the news folder', () =>
    request(app)
      .get('/@search?SearchableText=news*')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(/http:\/\/127.0.0.1:.*\/@search/),
          expect(res.body.items.length).toBe(1),
          expect(res.body.items[0]['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news/,
          ),
          expect(res.body.items[0]['@type']).toBe('folder'),
          expect(res.body.items[0].title).toBe('News'),
        ]),
      ));
  it('should be able to sort results on title', () =>
    request(app)
      .get('/@search?sort_on=sortable_title')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([expect(res.body.items[0].title).toBe('Events')]),
      ));
  it('should be able to sort results on date', () =>
    request(app)
      .get('/@search?sort_on=effective')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([expect(res.body.items[0].title).toBe('Welcome to Volto')]),
      ));
  it('should ignore sort when unknown sort is specified', () =>
    request(app)
      .get('/@search?sort_on=nonexisting')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([expect(res.body.items[0].title).toBe('Welcome to Volto')]),
      ));
  it('should be able to sort results reverse', () =>
    request(app)
      .get('/@search?sort_on=sortable_title&sort_order=descending')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([expect(res.body.items[0].title).toBe('Welcome to Volto')]),
      ));
  it('should be able to filter on depth', () =>
    request(app)
      .get('/@search?path.depth=1')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.items.length).toBe(3)])));
  it('should be able to set batch size', () =>
    request(app)
      .get('/@search?b_size=2')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.items.length).toBe(2)])));
  it('should be able to set offset', () =>
    request(app)
      .get('/@search?b_size=3&b_start=2')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.items.length).toBe(2)])));
  it('should ignore unknown parameters', () =>
    request(app)
      .get('/@search?nonexisting')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.items.length).toBe(4)])));
  it('should be able to do a querystring search', () =>
    request(app)
      .post('/@querystring-search')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => Promise.all([expect(res.body.items.length).toBe(4)])));
});
