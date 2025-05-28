import app from '../../app';
import { testRequest } from '../../helpers';

describe('Catalog', () => {
  it('should return the catalog info', () => testRequest(app, 'catalog/get'));
});
