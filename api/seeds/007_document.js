import { dropRight, last, map, omit } from 'lodash';
import { promises as fs } from 'fs';
import moment from 'moment';

import { mapSync } from '../src/helpers';

const documentFields = [
  'uuid',
  'parent',
  'id',
  'path',
  'created',
  'modified',
  'type',
  'position_in_parent',
  'version',
  'versions',
  'owner',
  'lock',
  'workflow_state',
];

const versionFields = ['uuid', 'version', 'id', 'created', 'actor', 'document'];

export const seed = async (knex) => {
  try {
    const children = {};
    const files = map(
      await fs.readdir(`${__dirname}/../profiles/documents`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();
    await mapSync(files, async (file) => {
      const document = require(`../profiles/documents/${file}`);
      const slugs = file.split('.');
      const id = last(slugs) === '_root' ? 'root' : last(slugs);
      const path = last(slugs) === '_root' ? '/' : `/${slugs.join('/')}`;
      const parent =
        last(slugs) === '_root'
          ? undefined
          : (
              await knex('document').where({
                path: `/${dropRight(slugs).join('/')}`,
              })
            )[0].uuid;
      const position_in_parent = parent ? children[parent] || 0 : 0;
      if (parent) {
        children[parent] = parent in children ? children[parent] + 1 : 1;
      }

      const versionCount =
        'versions' in document ? document.versions.length : 1;

      // Insert document
      const insert = await knex('document')
        .insert({
          version: 'version' in document ? document.version : versionCount - 1,
          id,
          path,
          parent,
          position_in_parent: document.position_in_parent || position_in_parent,
          lock: document.lock || {
            locked: false,
            stealable: true,
          },
          owner: document.owner || 'admin',
          workflow_state: document.workflow_state || 'published',
          type: document.type || 'Page',
          created: document.created || moment.utc().format(),
          modified: document.modified || moment.utc().format(),
          json: omit(document, documentFields),
        })
        .returning('uuid');
      const uuid = insert[0].uuid;

      // Create versions
      const versions =
        'versions' in document
          ? map(document.versions, (version, index) => ({
              version: version.version || index,
              created: version.created || moment.utc().format(),
              actor: version.actor || 'admin',
              document: uuid,
              id: version.id || id,
              json: omit(version, versionFields),
            }))
          : [
              {
                version: 0,
                created: document.created || moment.utc().format(),
                actor: document.owner || 'admin',
                document: uuid,
                id,
                json: omit(document, documentFields),
              },
            ];

      // Insert versions
      await knex('version').insert(versions);
    });
  } catch (e) {
    // No data to be imported
  }
};
