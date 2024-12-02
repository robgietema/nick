/**
 * Auth helper.
 * @module helpers/content/content
 */

import { isObject, isString, keys, last, map } from 'lodash';
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
        'content-type': mime.lookup(`${profile}${fields[field]}`),
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
        'content-type': mime.lookup(`${profile}${fields[field]}`),
        filename: last(fields[field].split('/')),
      };
    }

    // Check if new data is uploaded
    if (fields[field] && 'data' in fields[field]) {
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
 * @returns {Object} Fields with uuid info.
 */
export async function handleRelationLists(json, type) {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const relationListFields = await type.getFactoryFields('Relation List');

  // Strip all but the UID from the document data
  await mapAsync(relationListFields, async (field) => {
    if (fields[field]) {
      fields[field] = map(
        fields[field],
        (document) => document.UID || document,
      );
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle block references
 * @method handleBlockReferences
 * @param {Object} json Current json object.
 * @param {Object} trx Transaction object.
 * @returns {Object} Json with references expanded.
 */
export async function handleBlockReferences(json, trx) {
  // Make a copy of the json data
  const output = { ...json };
  const { Catalog } = require('../../models/catalog/catalog');

  const extendHref = async (href, trx) => {
    const target = await Catalog.fetchOne({ _path: href['@id'] }, {}, trx);
    if (target) {
      return {
        ...href,
        image_field: target.image_field,
        image_scales: target.image_scales,
      };
    }
    return href;
  };

  if (isObject(output.blocks)) {
    await Promise.all(
      map(keys(output.blocks), async (block) => {
        if (isObject(output.blocks[block].href)) {
          output.blocks[block].href[0] = await extendHref(
            output.blocks[block].href[0],
            trx,
          );
        }
        if (isObject(output.blocks[block].slides)) {
          await Promise.all(
            map(output.blocks[block].slides, async (slide, index) => {
              console.log('image');
              console.log(index);
              if (isObject(output.blocks[block].slides[index].image)) {
                console.log('image');
                output.blocks[block].slides[index].image[0] = await extendHref(
                  output.blocks[block].slides[index].image[0],
                  trx,
                );
              }
            }),
          );
        }
        if (isObject(output.blocks[block].blocks)) {
          await Promise.all(
            map(keys(output.blocks[block].blocks), async (subblock) => {
              if (isObject(output.blocks[block].blocks[subblock].href)) {
                output.blocks[block].blocks[subblock].href[0] =
                  await extendHref(
                    output.blocks[block].blocks[subblock].href[0],
                    trx,
                  );
              }
            }),
          );
        }
      }),
    );
  }

  // Return new json data
  return output;
}
