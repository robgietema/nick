import app from '../../app';
import helpers, {
  getPostgresVersion,
  getNodeVersion,
  testRequest,
} from '../../helpers';

// Mock formatSize
jest.mock('../../helpers', () => {
  const originalModule = jest.requireActual('../../helpers');
  return {
    __esModule: true,
    ...originalModule,
    getNodeVersion: () => 'v16.15.0',
    getPostgresVersion: () => '14.4',
  };
});

describe('System', () => {
  it('should get the system information', () => testRequest(app, 'system/get'));
});
