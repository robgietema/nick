import { transaction } from 'objection';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { Model } from './src/models';
import { knex } from './src/helpers';

import * as url from './src/helpers/url/url';

// Mock get url
jest
  .spyOn(url, 'getUrl')
  .mockImplementation(
    (req) =>
      `http://localhost:8080${
        req.document.path === '/' ? '' : req.document.path
      }`,
  );

// Mock get root url
jest
  .spyOn(url, 'getRootUrl')
  .mockImplementation((req) => 'http://localhost:8080');

// Mock JWT sign
jest
  .spyOn(jwt, 'sign')
  .mockReturnValue(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzNjE3NDIsImV4cCI6MTY0OTQwNDk0Mn0.SBqYCkWsHNHqzTUPIGC1c1Zd9iDARmqDecb3k7Ok7vE',
  );

// Mock uuid
jest.mock('uuid');
uuid.mockReturnValue('a95388f2-e4b3-4292-98aa-62656cbd5b9c');

// Mock moment
jest.spyOn(moment, 'utc').mockReturnValue({
  format: () => '2022-04-08T16:00:00.000Z',
});

global.beforeAll(async () => {
  global.knex = knex;
  global.txn = null;
});

global.beforeEach(async () => {
  global.txn = await transaction.start(knex);
  Model.knex(global.txn);
});

global.afterEach(async () => {
  await global.txn.rollback();
  Model.knex(knex);
});

global.afterAll(async () => {
  global.knex.destroy();
});
