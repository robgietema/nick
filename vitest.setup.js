import { beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { transaction } from 'objection';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { Model } from './src/models/_model/_model';
import { knex } from './src/helpers/knex/knex';

import * as url from './src/helpers/url/url';

// Mock get url
vi.spyOn(url, 'getUrl').mockImplementation(
  (req) =>
    `http://localhost:8080${
      req.document.path === '/' ? '' : req.document.path
    }`,
);

// Mock get url by path
vi.spyOn(url, 'getUrlByPath').mockImplementation(
  (req, path) => `http://localhost:8080${path === '/' ? '' : path}`,
);

// Mock get root url
vi.spyOn(url, 'getRootUrl').mockImplementation(
  (req) => 'http://localhost:8080',
);

// Mock JWT sign
vi.spyOn(jwt, 'sign').mockReturnValue(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4iLCJpYXQiOjE2NDkzNjE3NDIsImV4cCI6MTY0OTQwNDk0Mn0.SBqYCkWsHNHqzTUPIGC1c1Zd9iDARmqDecb3k7Ok7vE',
);

// Mock uuid
vi.mock('uuid');
vi.mocked(uuid).mockReturnValue('a95388f2-e4b3-4292-98aa-62656cbd5b9c');

// Mock moment
vi.spyOn(moment, 'utc').mockReturnValue({
  format: () => '2022-04-08T16:00:00.000Z',
});

beforeAll(async () => {
  global.knex = knex;
  global.txn = null;
});

beforeEach(async () => {
  global.txn = await transaction.start(knex);
  Model.knex(global.txn);
});

afterEach(async () => {
  await global.txn.rollback();
  Model.knex(knex);
});

afterAll(async () => {
  global.knex.destroy();
});
