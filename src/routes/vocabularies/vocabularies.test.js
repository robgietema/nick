import app from '../../app';
import { testRequest } from '../../helpers';

describe('Vocabularies', () => {
  it('should return the vocabularies', () =>
    testRequest(app, 'vocabularies/list'));

  it('should return a single vocabulary', () =>
    testRequest(app, 'vocabularies/get'));

  it('should return a actions vocabulary', () =>
    testRequest(app, 'vocabularies/get_actions'));

  it('should return a behaviors vocabulary', () =>
    testRequest(app, 'vocabularies/get_behaviors'));

  it('should return a groups vocabulary', () =>
    testRequest(app, 'vocabularies/get_groups'));

  it('should return a image scales vocabulary', () =>
    testRequest(app, 'vocabularies/get_image_scales'));

  it('should return a permissions vocabulary', () =>
    testRequest(app, 'vocabularies/get_permissions'));

  it('should return a subjects vocabulary', () =>
    testRequest(app, 'vocabularies/get_subjects'));

  it('should return a supported languages vocabulary', () =>
    testRequest(app, 'vocabularies/get_supported_languages'));

  it('should return a system groups vocabulary', () =>
    testRequest(app, 'vocabularies/get_system_groups'));

  it('should return a system users vocabulary', () =>
    testRequest(app, 'vocabularies/get_system_users'));

  it('should return a system types vocabulary', () =>
    testRequest(app, 'vocabularies/get_types'));

  it('should return a system users vocabulary', () =>
    testRequest(app, 'vocabularies/get_users'));

  it('should return a workflows vocabulary', () =>
    testRequest(app, 'vocabularies/get_workflows'));
});
