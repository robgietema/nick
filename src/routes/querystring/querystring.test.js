import request from 'supertest';

import app from '../../app';
import { getAdminHeader } from '../../helpers';

describe('Querystring', () => {
  it('should return the querystring options', () =>
    request(app)
      .get('/@querystring')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/@querystring/,
          ),
          expect(res.body.indexes.length).toBeDefined,
        ]),
      ));
});
