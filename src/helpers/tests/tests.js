/**
 * Test.
 * @module helpers/tests/tests
 */

import request from 'supertest';
import fs from 'fs';
import path from 'path';
import _, { indexOf, join, slice } from 'lodash';

/**
 * Read file
 * @method readFile
 * @param {string} filename Filename to read
 * @returns {Object} Object with request, headers and body of the file
 */
function readFile(filename) {
  // Read request file
  const data = fs
    .readFileSync(`${process.cwd()}/docs/examples/${filename}`)
    .toString()
    .split(/\r?\n/);

  // Get method, url and headers from request
  const request = data[0];
  const headerLength = indexOf(data, '') || data.length;
  const headers = _(data)
    .slice(1, headerLength)
    .map((header) => header.split(': '))
    .fromPairs()
    .value();

  // Get body from request
  const body =
    data.length - 1 > headerLength
      ? JSON.parse(join(slice(data, headerLength), '\n'))
      : null;

  return {
    request,
    headers,
    body,
  };
}

/**
 * Read request
 * @method readReq
 * @param {string} filename Filename to read
 * @returns {Object} Object with method, url, headers and body of the file
 */
function readReq(filename) {
  const data = readFile(`${filename}.req`);
  const [method, url] = data.request.split(' ');
  return {
    method,
    url,
    reqHeaders: data.headers,
    reqBody: data.body,
  };
}

/**
 * Read response
 * @method readRes
 * @param {string} filename Filename to read
 * @returns {Object} Object with status, headers and body of the file
 */
function readRes(filename) {
  const data = readFile(`${filename}.res`);
  const [http, status] = data.request.split(' ');
  return {
    status: parseInt(status, 10),
    resHeaders: data.headers,
    resBody: data.body,
  };
}

/**
 * Test request
 * @method testRequest
 * @param {Object} app App object
 * @param {string} filename Filename to read
 * @returns {Object} Test object
 */
export function testRequest(app, filename) {
  const { method, url, reqHeaders, reqBody } = readReq(filename);
  const { status, resHeaders, resBody } = readRes(filename);

  // Do the call
  const result = request(app)
    [method.toLowerCase()](url)
    .set(reqHeaders)
    .send(reqBody);

  // Check result
  if (resBody) {
    return result
      .expect(status)
      .expect((res) => expect(res.body).toStrictEqual(resBody));
  } else {
    return result.expect(status);
  }
}
