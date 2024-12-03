import app from '../../app';
import { testRequest } from '../../helpers';

describe('Form', () => {
  it('should submit a form', () => testRequest(app, 'search/post'));
});
