import app from '../../app';
import { testRequest } from '../../helpers/tests/tests';

// Mock getNodeVersion
jest.mock('../../helpers/utils/utils', () => {
  const originalModule = jest.requireActual('../../helpers/utils/utils');
  return {
    __esModule: true,
    ...originalModule,
    getNodeVersion: () => 'v16.15.0',
  };
});

// Mock getPostgresVersion
jest.mock('../../helpers/knex/knex', () => {
  const originalModule = jest.requireActual('../../helpers/knex/knex');
  return {
    __esModule: true,
    ...originalModule,
    getPostgresVersion: () => '14.4',
  };
});

describe('System', () => {
  it('should get the system information', () => testRequest(app, 'system/get'));
});
