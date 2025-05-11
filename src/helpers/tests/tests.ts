/**
 * Test.
 * @module helpers/tests/tests
 */

import request, { Response } from 'supertest';
import fs from 'fs';
import _, { indexOf, join, slice } from 'lodash';
import { Application } from 'express';
import type { AllMethods } from 'supertest/types';

interface FileData {
  request: string;
  headers: { [key: string]: string };
  body: any;
}

interface RequestData {
  method: AllMethods;
  url: string;
  reqHeaders: { [key: string]: string };
  reqBody: any;
}

interface ResponseData {
  status: number;
  resHeaders: { [key: string]: string };
  resBody: any;
}

/**
 * Read file
 * @method readFile
 * @param {string} filename Filename to read
 * @returns {FileData} Object with request, headers and body of the file
 */
function readFile(filename: string): FileData {
  // Read request file
  const data: string[] = fs
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
 * @returns {RequestData} Object with method, url, headers and body of the file
 */
function readReq(filename: string): RequestData {
  const data = readFile(`${filename}.req`);
  const [method, url] = data.request.split(' ');
  return {
    method: method.toLowerCase() as AllMethods,
    url,
    reqHeaders: data.headers,
    reqBody: data.body,
  };
}

/**
 * Read response
 * @method readRes
 * @param {string} filename Filename to read
 * @returns {ResponseData} Object with status, headers and body of the file
 */
function readRes(filename: string): ResponseData {
  const data = readFile(`${filename}.res`);
  const [, status] = data.request.split(' ');
  return {
    status: parseInt(status, 10),
    resHeaders: data.headers,
    resBody: data.body,
  };
}

/**
 * Test request
 * @method testRequest
 * @param {Application} app Express App object
 * @param {string} filename Filename to read
 * @returns {request.Test} Test object
 */
export function testRequest(app: Application, filename: string): request.Test {
  const { method, url, reqHeaders, reqBody } = readReq(filename);
  const { status, resBody } = readRes(filename);

  // Do the call
  const result = request(app)
    [method as AllMethods](url)
    .set(reqHeaders)
    .send(reqBody);

  // Check result
  if (resBody) {
    return result
      .expect(status)
      .expect((res: Response) => expect(res.body).toStrictEqual(resBody));
  } else {
    return result.expect(status);
  }
}
