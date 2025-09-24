import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

describe('Form', () => {
  it('should submit a form', () => testRequest(app, 'form/post'));
});
