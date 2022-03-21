/**
 * File system helper.
 * @module helpers/fs/fs
 */

import fs from 'fs';
import { v4 as uuid } from 'uuid';

import config from '../../../config';

/**
 * Read file
 * @method readFile
 * @param {string} uuid Uuid of the file to read.
 * @returns {Buffer} File buffer.
 */
export function readFile(uuid) {
  return fs.readFileSync(`${config.blobsDir}/${uuid}`);
}

/**
 * Write file
 * @method writeFile
 * @param {String} data Data of the file
 * @param {String} encoding Encoding of the file data
 * @returns {Promise} A Promise that resolves when the file has been written.
 */
export async function writeFile(data, encoding) {
  const buffer = Buffer.from(data, encoding);
  const id = uuid();

  // Write file to disk
  fs.writeFileSync(`${config.blobsDir}/${id}`, buffer);

  // Return data
  return {
    uuid: id,
    size: Buffer.byteLength(buffer),
  };
}
