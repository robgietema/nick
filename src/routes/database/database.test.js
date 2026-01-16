import { describe, it, vi } from 'vitest';
import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

// Mock formatSize
vi.mock('../../helpers/format/format', async () => {
  const originalModule = await vi.importActual('../../helpers/format/format');
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
