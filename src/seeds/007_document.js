import { dropRight, last, map, omit } from 'lodash';
import { promises as fs } from 'fs';
import moment from 'moment';

import { log, mapAsync, stripI18n } from '../helpers';
import { Document } from '../models';

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
  'sharing',
];

const versionFields = ['uuid', 'version', 'id', 'created', 'actor', 'document'];

export const seed = async (knex) => {
  try {
    const children = {};
    const files = map(
      await fs.readdir(`${__dirname}/../profiles/documents`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();
    await mapAsync(files, async (file) => {
      const document = stripI18n(require(`../profiles/documents/${file}`));
      const slugs = file.split('.');
      const id = last(slugs) === '_root' ? 'root' : last(slugs);
      const path = last(slugs) === '_root' ? '/' : `/${slugs.join('/')}`;
      const parent =
        last(slugs) === '_root'
          ? undefined
          : (
              await Document.fetchOne(
                {
                  path: `/${dropRight(slugs).join('/')}`,
                },
                {},
                knex,
              )
            ).uuid;
      const position_in_parent = parent ? children[parent] || 0 : 0;
      if (parent) {
        children[parent] = parent in children ? children[parent] + 1 : 1;
      }

      const versionCount =
        'versions' in document ? document.versions.length : 1;

      // Insert document
      const insert = await Document.create(
        {
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
        },
        {},
        knex,
      );
      const uuid = insert.uuid;

      // Create versions
      const versions =
        'versions' in document
          ? map(document.versions, (version, index) => ({
              version: version.version || index,
              created: version.created || moment.utc().format(),
              actor: version.actor || 'admin',
              id: version.id || id,
              json: omit(version, versionFields),
            }))
          : [
              {
                version: 0,
                created: document.created || moment.utc().format(),
                actor: document.owner || 'admin',
                id,
                json: omit(document, documentFields),
              },
            ];

      // Insert versions
      await mapAsync(versions, async (version) => {
        await insert.createRelated('_versions', version, knex);
      });

      // Insert sharing data for users
      const sharingUsers = document.sharing?.users || [];
      await mapAsync(sharingUsers, async (user) => {
        await knex('user_role_document').insert(
          map(user.roles, (role) => ({ user: user.id, role, document: uuid })),
        );
      });

      // Insert sharing data for groups
      const sharingGroups = document.sharing?.groups || [];
      await mapAsync(sharingGroups, async (group) => {
        await knex('group_role_document').insert(
          map(group.roles, (role) => ({
            group: group.id,
            role,
            document: uuid,
          })),
        );
      });
    });
    log.info('Documents imported');
  } catch (err) {
    log.error(err);
  }
};
