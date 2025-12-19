import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

// Mock formatSize
jest.mock('../../helpers/format/format', () => {
  const originalModule = jest.requireActual('../../helpers/format/format');
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
