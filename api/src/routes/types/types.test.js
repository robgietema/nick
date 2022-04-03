import request from 'supertest';

import app from '../../app';
import { getAdminHeader } from '../../helpers';

describe('Types', () => {
  it('should return a list of types', () =>
    request(app)
      .get('/@types')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(5);
        expect(res.body[0]['@id']).toBeDefined();
        expect(res.body[0].title).toBeDefined();
        expect(res.body[0].addable).toBeDefined();
      }));
  it('should return a type', () =>
    request(app)
      .get('/@types/Page')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Page');
      }));
  it('should return not found when type not found', () =>
    request(app)
      .get('/@types/Random')
      .set('Authorization', getAdminHeader())
      .expect(404));
});
