import app from '../../app';
import { testRequest } from '../../helpers';
import * as url from '../../helpers/url/url';

jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8000');

describe('Groups', () => {
  afterEach(async () => {
    await testRequest(app, 'groups/groups_delete');
  });

  it('should get a list of groups', () =>
    testRequest(app, 'groups/groups_list'));

  it('should get a list of groups by query', () =>
    testRequest(app, 'groups/groups_list_query'));

  it('should get an error when not logged in', () =>
    testRequest(app, 'groups/groups_list_anonymous'));

  it('should get an individual group', () =>
    testRequest(app, 'groups/groups_get'));

  it('should not get a group when not logged in', () =>
    testRequest(app, 'groups/groups_get_anonymous'));

  it('should not get a group when not found', () =>
    testRequest(app, 'groups/groups_get_notfound'));

  it('should add a new group', () => testRequest(app, 'groups/groups_post'));

  it('should update a group', async () => {
    await testRequest(app, 'groups/groups_post');
    return testRequest(app, 'groups/groups_patch');
  });

  it('should delete a group', async () => {
    await testRequest(app, 'groups/groups_post');
    return testRequest(app, 'groups/groups_delete');
  });
});
