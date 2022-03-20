import { map, omit } from 'lodash';
import { promises as fs } from 'fs';
import { mapSync } from '../src/helpers';

export const seed = async (knex) => {
  try {
    const files = await fs.readdir(`${__dirname}/../profiles/documents`);
    await mapSync(files, async (file) => {
      const document = require(`../profiles/documents/${file}`);
      const versions =
        'versions' in document
          ? map(document.versions, (version, index) => ({
              ...version,
              document: document.uuid,
              version: index,
            }))
          : [
              {
                version: 0,
                id: document.id,
                created: document.created,
                actor: document.owner,
                document: document.uuid,
                json: document.json,
              },
            ];

      // Insert document
      await knex('document').insert({
        ...omit(document, ['versions']),
        version: 'version' in document ? document.version : versions.length - 1,
      });

      // Insert versions
      await knex('version').insert(versions);

      //        const groupRoles = map(group.roles, (role) => ({
      //          group: group.id,
      //          role,
      //        }));
      //        if (groupRoles.length > 0) {
      //          await knex('group_role').insert(groupRoles);
      //        }
    });
  } catch (e) {
    // No data to be imported
  }
};
