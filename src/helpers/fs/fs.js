/**
 * File system helper.
 * @module helpers/fs/fs
 */

import { keys, max, round } from 'lodash';
import {
  copyFileSync,
  rmSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'fs';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';

import { mapAsync } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

/**
 * Get scale dimensions
 * @method getScaleDimensions
 * @param {Number} orgWidth Original width
 * @param {Number} orgHeight Original height
 * @param {Number} limitWidth Limit width
 * @param {Number} limitHeight Limit height
 * @returns {Object} Object with new width and height attributes
 */
export function getScaleDimensions(
  orgWidth,
  orgHeight,
  limitWidth,
  limitHeight,
) {
  const scale = max([orgWidth / limitWidth, orgHeight / limitHeight]);
  return [round(orgWidth / scale), round(orgHeight / scale)];
}

/**
 * Get dimensions
 * @method getDimensions
 * @param {Object} metadata Image metadata
 * @returns {Array} Array of width and height.
 */
export function getDimensions(metadata) {
  return metadata.orientation && metadata.orientation > 4
    ? [metadata.height, metadata.width]
    : [metadata.width, metadata.height];
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
 * Read profile file
 * @method readProfileFile
 * @param {string} profile Profile path
 * @param {string} path Path of the file
 * @returns {string} Base64 string of the file
 */
export function readProfileFile(profile, path) {
  const file = `${profile}${path}`;
  if (!existsSync(file)) {
    throw `Can not read file: ${file}`;
  }
  return readFileSync(file, { encoding: 'base64' });
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
  const [width, height] = getDimensions(metadata);
  const scales = {};

  // Write scales
  await mapAsync(keys(config.imageScales), async (scale) => {
    const scaleId = uuid();
    if ((await image.metadata()).format === 'svg') {
      writeFileSync(`${config.blobsDir}/${scaleId}`, buffer);
    } else {
      const scaleImage = sharp(buffer)
        .rotate()
        .resize(...config.imageScales[scale], {
          fit: 'inside',
        });
      await scaleImage.toFile(`${config.blobsDir}/${scaleId}`);
    }
    const [scaleWidth, scaleHeight] = getScaleDimensions(
      width,
      height,
      ...config.imageScales[scale],
    );
    scales[scale] = {
      uuid: scaleId,
      width: scaleWidth,
      height: scaleHeight,
    };
  });

  // Return data
  return {
    uuid: id,
    size: Buffer.byteLength(buffer),
    width,
    height,
    scales,
  };
}

/**
 * Remove file
 * @method removeFile
 * @param {string} uuid Uuid of the file to remove.
 */
export function removeFile(uuid) {
  rmSync(`${config.blobsDir}/${uuid}`);
}

/**
 * Copy file
 * @method copyFile
 * @param {string} source Uuid of the source file.
 * @param {string} target Uuid of the target file.
 */
export function copyFile(source, target) {
  copyFileSync(`${config.blobsDir}/${source}`, `${config.blobsDir}/${target}`);
}

/**
 * Check if file exists
 * @method fileExists
 * @param {string} file Path of the file to check.
 */
export function fileExists(file) {
  return existsSync(`${file}.js`) || existsSync(`${file}.json`);
}

/**
 * Check if directory exists
 * @method dirExists
 * @param {string} directory Path of the directory to check.
 */
export function dirExists(dir) {
  return existsSync(dir);
}
