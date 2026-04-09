import { describe, it } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Controlpanels', () => {
  it('should return the controlpanels', () =>
    testRequest(app, 'controlpanels/list'));

  it('should return a controlpanel', () =>
    testRequest(app, 'controlpanels/get'));

  it('should update a controlpanel', () =>
    testRequest(app, 'controlpanels/patch'));

  it('should return the types controlpanel', () =>
    testRequest(app, 'controlpanels/get_types'));

  it('should add a type in the types controlpanel', () =>
    testRequest(app, 'controlpanels/post_types'));

  it('should delete a type in the types controlpanel', () =>
    testRequest(app, 'controlpanels/delete_type'));

  it('should get a type in the types controlpanel', () =>
    testRequest(app, 'controlpanels/get_type'));

  it('should update a type in the types controlpanel', () =>
    testRequest(app, 'controlpanels/patch_type'));

  it('should return the content rules controlpanel', () =>
    testRequest(app, 'controlpanels/get_content_rules'));

  it('should add a content rule in the content rules controlpanel', () =>
    testRequest(app, 'controlpanels/post_content_rules'));

  it('should delete a content rule in the content rules controlpanel', () =>
    testRequest(app, 'controlpanels/delete_content_rule'));

  it('should get a content rule in the content rules controlpanel', () =>
    testRequest(app, 'controlpanels/get_content_rule'));

  it('should update a content rule in the content rules controlpanel', () =>
    testRequest(app, 'controlpanels/patch_content_rule'));
});
