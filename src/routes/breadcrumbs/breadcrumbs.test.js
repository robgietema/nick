import request from 'supertest';

import app from '../../app';
import { getAdminHeader } from '../../helpers';

describe('Content', () => {
  it('should return the navigation', () =>
    request(app)
      .get('/news/@breadcrumbs')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news\/@breadcrumbs/,
          ),
          expect(res.body.items.length).toBe(1),
          expect(res.body.items[0]['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news/,
          ),
          expect(res.body.items[0].title).toBe('News'),
        ]),
      ));
});
