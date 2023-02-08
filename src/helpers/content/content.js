/**
 * Auth helper.
 * @module helpers/content/content
 */

import { isString, last, map } from 'lodash';
import mime from 'mime-types';

import {
  mapAsync,
  mapSync,
  readProfileFile,
  writeFile,
  writeImage,
} from '../../helpers';

/**
 * Handle file uploads and updates
 * @method handleFiles
 * @param {Object} json Current json object.
 * @param {Object} type Type object.
 * @param {string} profile Path of the profile.
 * @returns {Object} Fields with uuid info.
 */
export async function handleFiles(json, type, profile) {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const fileFields = await type.getFactoryFields('File');

  mapSync(fileFields, (field) => {
    // Check if filename is specified
    if (isString(fields[field])) {
      fields[field] = {
        data: readProfileFile(profile, fields[field]),
        encoding: 'base64',
        'content-type': mime.lookup(`${profile}/documents${fields[field]}`),
        filename: last(fields[field].split('/')),
      };
    }

    // Check if new data is uploaded
    if ('data' in fields[field]) {
      // Create filestream
      const { uuid, size } = writeFile(
        fields[field].data,
        fields[field].encoding,
      );

      // Set data
      fields[field] = {
        'content-type': fields[field]['content-type'],
        uuid,
        filename: fields[field].filename,
        size,
      };
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle image uploads and updates
 * @method handleImages
 * @param {Object} json Current json object.
 * @param {Object} type Type object.
 * @param {string} profile Path of the profile.
 * @returns {Object} Fields with uuid info.
 */
export async function handleImages(json, type, profile) {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const imageFields = await type.getFactoryFields('Image');

  await mapAsync(imageFields, async (field) => {
    // Check if filename is specified
    if (isString(fields[field])) {
      fields[field] = {
        data: readProfileFile(profile, fields[field]),
        encoding: 'base64',
        'content-type': mime.lookup(`${profile}/documents${fields[field]}`),
        filename: last(fields[field].split('/')),
      };
    }

    // Check if new data is uploaded
    if ('data' in fields[field]) {
      // Create filestream
      const { uuid, size, width, height, scales } = await writeImage(
        fields[field].data,
        fields[field].encoding,
      );

      // Set data
      fields[field] = {
        'content-type': fields[field]['content-type'],
        uuid,
        width,
        height,
        scales,
        filename: fields[field].filename,
        size,
      };
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle relation lists
 * @method handleRelationLists
 * @param {Object} json Current json object.
 * @param {Object} type Type object.
 * @param {string} profile Path of the profile.
 * @returns {Object} Fields with uuid info.
 */
export async function handleRelationLists(json, type, profile) {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const relationListFields = await type.getFactoryFields('Relation List');

  // Strip all but the UID from the document data
  await mapAsync(relationListFields, async (field) => {
    fields[field] = map(fields[field], (document) => document.UID || document);
  });

  // Return new field data
  return fields;
}
