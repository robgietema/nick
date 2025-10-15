import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

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
    testRequest(app, 'database/get'));
});
