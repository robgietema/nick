/**
 * File system helper.
 * @module helpers/fs/fs
 */

import { keys } from 'lodash';
import { rmSync, readFileSync, writeFileSync } from 'fs';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';

import config from '../../../config';
import { mapAsync } from '../../helpers';

/**
 * Get width
 * @method getWidth
 * @param {Object} metadata Image metadata
 * @returns {Number} Width of the image.
 */
export function getWidth(metadata) {
  return metadata.orientation && metadata.orientation > 4
    ? metadata.height
    : metadata.width;
}

/**
 * Get height
 * @method getHeight
 * @param {Object} metadata Image metadata
 * @returns {Number} Height of the image.
 */
export function getHeight(metadata) {
  return metadata.orientation && metadata.orientation > 4
    ? metadata.width
    : metadata.height;
}

/**
 * Read file
 * @method readFile
 * @param {string} uuid Uuid of the file to read.
 * @returns {Buffer} File buffer.
 */
export function readFile(uuid) {
  return readFileSync(`${config.blobsDir}/${uuid}`);
}

/**
 * Write file
 * @method writeFile
 * @param {String} data Data of the file
 * @param {String} encoding Encoding of the file data
 * @returns {Promise} A Promise that resolves when the file has been written.
 */
export function writeFile(data, encoding) {
  const buffer = Buffer.from(data, encoding);
  const id = uuid();

  // Write file to disk
  writeFileSync(`${config.blobsDir}/${id}`, buffer);

  // Return data
  return {
    uuid: id,
    size: Buffer.byteLength(buffer),
  };
}

/**
 * Write image
 * @method writeImage
 * @param {String} data Data of the image
 * @param {String} encoding Encoding of the image data
 * @returns {Promise} A Promise that resolves when the images have been written.
 */
export async function writeImage(data, encoding) {
  const buffer = Buffer.from(data, encoding);
  const id = uuid();

  // Write file to disk
  writeFileSync(`${config.blobsDir}/${id}`, buffer);

  // Create image and get metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const scales = {};

  // Write scales
  await mapAsync(keys(config.imageScales), async (scale) => {
    const scaleId = uuid();
    const scaleImage = sharp(buffer).resize(...config.imageScales[scale], {
      fit: 'inside',
    });
    await scaleImage.toFile(`${config.blobsDir}/${scaleId}`);
    const scaleMetadata = await scaleImage.metadata();
    scales[scale] = {
      uuid: scaleId,
      width: getWidth(scaleMetadata),
      height: getHeight(scaleMetadata),
    };
  });

  // Return data
  return {
    uuid: id,
    size: Buffer.byteLength(buffer),
    width: getWidth(metadata),
    height: getHeight(metadata),
    scales,
  };
}

/**
 * Remove file
 * @method removeFile
 * @param {string} uuid Uuid of the file to remove.
 * @returns {undefined} File buffer.
 */
export function removeFile(uuid) {
  rmSync(`${config.blobsDir}/${uuid}`);
}
