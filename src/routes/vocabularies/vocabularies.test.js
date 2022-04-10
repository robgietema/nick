import app from '../../app';
import { testRequest } from '../../helpers';

describe('Vocabularies', () => {
  it('should return the vocabularies', () =>
    testRequest(app, 'vocabularies/vocabularies_list'));

  it('should return a single vocabulary', () =>
    testRequest(app, 'vocabularies/vocabularies_get'));
});
