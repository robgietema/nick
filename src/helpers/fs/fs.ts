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
import type { Metadata } from 'sharp';

import { mapAsync } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

/**
 * Get scale dimensions
 * @method getScaleDimensions
 * @param {number} orgWidth Original width
 * @param {number} orgHeight Original height
 * @param {number} limitWidth Limit width
 * @param {number} limitHeight Limit height
 * @returns {[number, number]} Object with new width and height attributes
 */
export function getScaleDimensions(
  orgWidth: number,
  orgHeight: number,
  limitWidth: number,
  limitHeight: number,
): [number, number] {
  const scale = max([orgWidth / limitWidth, orgHeight / limitHeight]) || 1;
  return [round(orgWidth / scale), round(orgHeight / scale)];
}

/**
 * Image dimensions
 * @typedef {[number, number]} Dimensions
 */
export type Dimensions = [number, number];

/**
 * Get dimensions
 * @method getDimensions
 * @param {Metadata} metadata Image metadata
 * @returns {Dimensions} Array of width and height.
 */
export function getDimensions(metadata: Metadata): Dimensions {
  return metadata.orientation && metadata.orientation > 4
    ? [metadata.height || 0, metadata.width || 0]
    : [metadata.width || 0, metadata.height || 0];
}

/**
 * Read file
 * @method readFile
 * @param {string} uuid Uuid of the file to read.
 * @returns {Buffer} File buffer.
 */
export function readFile(uuid: string): Buffer {
  return readFileSync(`${config.blobsDir}/${uuid}`);
}

/**
 * Read profile file
 * @method readProfileFile
 * @param {string} profile Profile path
 * @param {string} path Path of the file
 * @returns {string} Base64 string of the file
 */
export function readProfileFile(profile: string, path: string): string {
  const file = `${profile}${path}`;
  if (!existsSync(file)) {
    throw `Can not read file: ${file}`;
  }
  return readFileSync(file, { encoding: 'base64' });
}

/**
 * Buffer encoding
 * @typedef {('ascii'|'base64'|'binary'|'hex'|'latin1'|'ucs-2'|'ucs2'|'utf-8'|'utf16le'|'utf8')} BufferEncoding
 */

/**
 * Write file meta data
 * @typedef {object} WriteFileMeta
 * @property {string} uuid Uuid of the file
 * @property {number} size Size of the file
 */
export interface WriteFileMeta {
  uuid: string;
  size: number;
}

/**
 * Write file
 * @method writeFile
 * @param {string} data Data of the file
 * @param {BufferEncoding} encoding Encoding of the file data
 * @returns {WriteFileMeta} Return data of the file written.
 */
export function writeFile(
  data: string,
  encoding: BufferEncoding,
): WriteFileMeta {
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
 * Image Scale
 * @typedef {object} ImageScale
 * @property {string} uuid Uuid of the image
 * @property {number} width Size of the image
 * @property {number} height Size of the image
 */
export interface ImageScale {
  uuid: string;
  width: number;
  height: number;
}

/**
 * Image Scales
 * @typedef {object.<string, ImageScale>} ImageScales
 */
export interface ImageScales {
  [index: string]: ImageScale;
}

/**
 * Write image meta data
 * @typedef {object} WriteImageMeta
 * @property {string} uuid Uuid of the image
 * @property {number} size Size of the image
 * @property {number} width Size of the image
 * @property {number} height Size of the image
 */
export interface WriteImageMeta {
  uuid: string;
  size: number;
  width: number;
  height: number;
  scales: ImageScales;
}

/**
 * Write image
 * @method writeImage
 * @param {string} data Data of the image
 * @param {BufferEncoding} encoding Encoding of the image data
 * @returns {Promise<WriteImageMeta>} Return data of the image written.
 */
export async function writeImage(
  data: string,
  encoding: BufferEncoding,
): Promise<WriteImageMeta> {
  const buffer = Buffer.from(data, encoding);
  const id = uuid();

  // Write file to disk
  writeFileSync(`${config.blobsDir}/${id}`, buffer);

  // Create image and get metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const [width, height] = getDimensions(metadata);
  const scales: ImageScales = {};

  // Write scales
  await mapAsync(keys(config.imageScales), async (scale: string) => {
    const scaleId = uuid();
    if ((await image.metadata()).format === 'svg') {
      writeFileSync(`${config.blobsDir}/${scaleId}`, buffer);
    } else {
      const scaleImage = sharp(buffer)
        .rotate()
        .resize(config.imageScales[scale][0], config.imageScales[scale][1], {
          fit: 'inside',
        });
      await scaleImage.toFile(`${config.blobsDir}/${scaleId}`);
    }
    const [scaleWidth, scaleHeight] = getScaleDimensions(
      width,
      height,
      config.imageScales[scale][0],
      config.imageScales[scale][1],
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
export function removeFile(uuid: string) {
  rmSync(`${config.blobsDir}/${uuid}`);
}

/**
 * Copy file
 * @method copyFile
 * @param {string} source Uuid of the source file.
 * @param {string} target Uuid of the target file.
 */
export function copyFile(source: string, target: string) {
  copyFileSync(`${config.blobsDir}/${source}`, `${config.blobsDir}/${target}`);
}

/**
 * Check if file exists
 * @method fileExists
 * @param {string} file Path of the file to check.
 * @returns {boolean} True if file exists
 */
export function fileExists(file: string): boolean {
  return existsSync(`${file}.js`) || existsSync(`${file}.json`);
}

/**
 * Check if directory exists
 * @method dirExists
 * @param {string} dir Path of the directory to check.
 * @returns {boolean} True if dir exists
 */
export function dirExists(dir: string): boolean {
  return existsSync(dir);
}
