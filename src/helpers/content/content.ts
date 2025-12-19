/**
 * Auth helper.
 * @module helpers/content/content
 */

import { isObject, isString, keys, last, map } from 'lodash';
import mime from 'mime-types';
import pdfParse from 'pdf-parse';
import { Knex } from 'knex';

import { mapAsync } from '../utils/utils';
import { readProfileFile, writeFile, writeImage } from '../fs/fs';
import { vision } from '../ai/ai';

import { Catalog } from '../../models/catalog/catalog';

import config from '../config/config';

interface Type {
  getFactoryFields(fieldType: string): Promise<string[]>;
}

interface BlockHref {
  '@id': string;
  image_field?: string;
  image_scales?: Record<string, any>;
}

interface Block {
  href?: BlockHref[];
  slides?: Array<{
    image?: BlockHref[];
  }>;
  blocks?: Record<string, Block>;
}

interface Json {
  blocks?: Record<string, Block>;
  [key: string]: any;
}

/**
 * Handle file uploads and updates
 * @method handleFiles
 * @param {Json} json Current json object.
 * @param {Type} type Type object.
 * @param {string} profile Path of the profile.
 * @returns {Json} Fields with uuid info.
 */
export async function handleFiles(
  json: Json,
  type: Type,
  profile: string,
): Promise<Json> {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const fileFields = await type.getFactoryFields('File');

  await mapAsync(fileFields, async (field) => {
    // Check if filename is specified
    if (isString(fields[field])) {
      fields[field] = {
        data: readProfileFile(profile, fields[field]),
        encoding: 'base64',
        'content-type':
          mime.lookup(`${profile}${fields[field]}`) ||
          'application/octet-stream',
        filename: last(fields[field].split('/')) || '',
      };
    }

    // Check if new data is uploaded
    if ('data' in fields[field]) {
      // Create filestream
      const { uuid, size } = writeFile(
        fields[field].data,
        fields[field].encoding,
      );

      // Check if pdf
      let text = '';
      if (fields[field]['content-type'] === 'application/pdf') {
        const buffer = Buffer.from(fields[field].data, fields[field].encoding);
        const result = await pdfParse(buffer);
        text = result.text || '';
      }

      // Set data
      fields[field] = {
        'content-type': fields[field]['content-type'],
        uuid,
        filename: fields[field].filename,
        size,
        text,
      };
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle image uploads and updates
 * @method handleImages
 * @param {Json} json Current json object.
 * @param {Type} type Type object.
 * @param {string} profile Path of the profile.
 * @returns {Json} Fields with uuid info.
 */
export async function handleImages(
  json: Json,
  type: Type,
  profile: string,
): Promise<Record<string, any>> {
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
        'content-type':
          mime.lookup(`${profile}${fields[field]}`) ||
          'application/octet-stream',
        filename: last(fields[field].split('/')) || '',
      };
    }

    // Check if new data is uploaded
    if (fields[field] && 'data' in fields[field]) {
      // Create filestream
      const { uuid, size, width, height, scales } = await writeImage(
        fields[field].data,
        fields[field].encoding,
      );

      // Check if vision is enabled
      let text = '';
      if (config.settings.ai?.models?.vision?.enabled) {
        // Add vision data
        const result = await vision(fields[field].data);
        text = result.response || '';
      }

      // Set data
      fields[field] = {
        'content-type': fields[field]['content-type'],
        uuid,
        width,
        height,
        scales,
        filename: fields[field].filename,
        size,
        text,
      };
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle relation lists
 * @method handleRelationLists
 * @param {Json} json Current json object.
 * @param {Type} type Type object.
 * @returns {Json} Fields with uuid info.
 */
export async function handleRelationLists(
  json: Json,
  type: Type,
): Promise<Record<string, any>> {
  // Make a copy of the json data
  const fields = { ...json };

  // Get file fields
  const relationListFields = await type.getFactoryFields('Relation List');

  // Strip all but the UID from the document data
  await mapAsync(relationListFields, async (field) => {
    if (fields[field]) {
      fields[field] = map(
        fields[field],
        (document: { UID: string } | string) =>
          typeof document === 'object' ? document.UID : document,
      );
    }
  });

  // Return new field data
  return fields;
}

/**
 * Handle block references
 * @method handleBlockReferences
 * @param {Json} json Current json object.
 * @param {Knex.Transaction} trx Transaction object.
 * @returns {Json} Json with references expanded.
 */
export async function handleBlockReferences(
  json: Json,
  trx: Knex.Transaction,
): Promise<Json> {
  // Make a copy of the json data
  const output = { ...json };

  const extendHref = async (
    href: BlockHref,
    trx: Knex.Transaction,
  ): Promise<BlockHref> => {
    const target = (await Catalog.fetchOne(
      { _path: href['@id'] },
      {},
      trx,
    )) as any;
    if (target) {
      return {
        ...href,
        image_field: target.image_field,
        image_scales: target.image_scales,
      };
    }
    return href;
  };

  if (output.blocks && isObject(output.blocks)) {
    await Promise.all(
      map(keys(output.blocks), async (block) => {
        if (isObject(output.blocks?.[block].href)) {
          output.blocks[block].href[0] = await extendHref(
            output.blocks[block].href[0],
            trx,
          );
        }
        if (isObject(output.blocks?.[block].slides)) {
          await Promise.all(
            map(output.blocks[block].slides, async (slide, index) => {
              if (isObject(output.blocks?.[block].slides?.[index].image)) {
                output.blocks[block].slides[index].image[0] = await extendHref(
                  output.blocks[block].slides[index].image[0],
                  trx,
                );
              }
            }),
          );
        }
        if (isObject(output.blocks?.[block].blocks)) {
          await Promise.all(
            map(keys(output.blocks[block].blocks), async (subblock) => {
              if (isObject(output.blocks?.[block].blocks?.[subblock].href)) {
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
