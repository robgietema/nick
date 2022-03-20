import { map, omit } from 'lodash';

export const seed = async (knex) => {
  try {
    const profile = require('../profiles/documents');
    if (profile.purge) {
      await knex('document').del();
    }
    await Promise.all(
      map(profile.documents, async (document) => {
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
          version:
            'version' in document ? document.version : versions.length - 1,
        });

        // Insert versions
        await knex('version').insert(versions);

        /*
        const groupRoles = map(group.roles, (role) => ({
          group: group.uuid,
          role,
        }));
        if (groupRoles.length > 0) {
          await knex('group_role').insert(groupRoles);
        }
        */
      }),
    );
  } catch (e) {
    // No data to be imported
  }
};
