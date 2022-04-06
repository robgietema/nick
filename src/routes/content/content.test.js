import request from 'supertest';

import app from '../../app';
import { Document } from '../../models';
import { getAdminHeader } from '../../helpers';

describe('Content', () => {
  afterEach(() =>
    Document.delete({
      id: 'my-news-item',
    }),
  );

  it('should return a content object', () =>
    request(app)
      .get('/news')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(/http:\/\/127.0.0.1:.*\/news/),
          expect(res.body['@type']).toBe('Folder'),
          expect(res.body.title).toBe('News'),
          expect(res.body.id).toBe('news'),
          expect(res.body.UID).toBeDefined(),
          expect(res.body.items).toBeDefined(),
          expect(res.body.is_folderish).toBe(true),
        ]),
      ));
  it('should return a content object of a specific version', () =>
    request(app)
      .get('/news/@history/0')
      .set('Authorization', getAdminHeader())
      .expect(200)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(/http:\/\/127.0.0.1:.*\/news/),
          expect(res.body['@type']).toBe('Folder'),
          expect(res.body.title).toBe('Old News'),
          expect(res.body.id).toBe('news'),
          expect(res.body.UID).toBeDefined(),
          expect(res.body.items).toBeDefined(),
          expect(res.body.is_folderish).toBe(true),
        ]),
      ));
  it('should add a content object', () =>
    request(app)
      .post('/news')
      .set('Authorization', getAdminHeader())
      .send({
        '@type': 'Page',
        title: 'My News Item',
        description: 'News Description',
      })
      .expect(201)
      .expect((res) =>
        Promise.all([
          expect(res.body['@id']).toMatch(
            /http:\/\/127.0.0.1:.*\/news\/my-news-item/,
          ),
          expect(res.body['@type']).toBe('Page'),
          expect(res.body.title).toBe('My News Item'),
          expect(res.body.description).toBe('News Description'),
          expect(res.body.id).toBe('my-news-item'),
          expect(res.body.UID).toBeDefined(),
        ]),
      ));
  it('should update a content object', async () => {
    await request(app)
      .post('/news')
      .set('Authorization', getAdminHeader())
      .send({
        '@type': 'Page',
        title: 'My News Item',
        description: 'News Description',
      });
    return request(app)
      .patch('/news/my-news-item')
      .set('Authorization', getAdminHeader())
      .send({
        title: 'My New News Item',
      })
      .expect(204);
  });
  it('should delete a content object', async () => {
    await request(app)
      .post('/news')
      .set('Authorization', getAdminHeader())
      .send({
        '@type': 'Page',
        title: 'My News Item',
        description: 'News Description',
      });
    return request(app)
      .delete('/news/my-news-item')
      .set('Authorization', getAdminHeader())
      .expect(204);
  });
  it('should return not found when content not found', () =>
    request(app)
      .get('/random')
      .set('Authorization', getAdminHeader())
      .expect(404));
});