import app from '../../app';
import helpers, { formatSize, testRequest } from '../../helpers';

// Mock formatSize
jest.mock('../../helpers', () => {
  const originalModule = jest.requireActual('../../helpers');
  return {
    __esModule: true,
    ...originalModule,
    formatSize: () => '10 MB',
  };
});

describe('Database', () => {
  it('should get the database information', () =>
    testRequest(app, 'database/database_get'));
});
