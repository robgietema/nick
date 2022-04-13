import app from '../../app';
import { testRequest } from '../../helpers';

describe('System', () => {
  it('should get the system information', () => testRequest(app, 'system/get'));
});
