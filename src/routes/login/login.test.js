import request from 'supertest';

import app from '../../app';

describe('Content', () => {
  it('should handle login', () =>
    request(app)
      .post('/@login')
      .send({
        login: 'admin',
        password: 'admin',
      })
      .expect(200)
      .expect((res) => expect(res.body.token).toBeDefined()));
  it('should fail on incorrect credentials', () =>
    request(app)
      .post('/@login')
      .send({
        login: 'admin',
        password: 'wrong',
      })
      .expect(401)
      .expect((res) =>
        expect(res.body.error.type).toBe('Invalid credentials'),
      ));
  it('should fail on invalid user', () =>
    request(app)
      .post('/@login')
      .send({
        login: 'doesntexist',
        password: 'wrong',
      })
      .expect(401)
      .expect((res) =>
        expect(res.body.error.type).toBe('Invalid credentials'),
      ));
  it('should fail on missing credentials', () =>
    request(app)
      .post('/@login')
      .send({
        login: 'admin',
      })
      .expect(400)
      .expect((res) =>
        expect(res.body.error.type).toBe('Missing credentials'),
      ));
  it('should handle login-renew', () =>
    request(app)
      .post('/@login-renew')
      .expect(200)
      .expect((res) => expect(res.body.token).toBeDefined()));
  it('should handle logout', () => request(app).post('/@logout').expect(204));
});
