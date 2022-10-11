import { map } from 'lodash';

import { fileExists, log, stripI18n } from '../helpers';
import { Index } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/catalog`)) {
          const profile = stripI18n(require(`${profilePath}/catalog`));
          await Promise.all(
            map(profile.indexes, async (index) => {
              // Add index
              if (index.enabled) {
                await Index.create(
                  {
                    id: index.name,
                    title: index.title,
                    description: index.description,
                    group: index.group,
                    enabled: index.enabled,
                    sortable: index.sortable,
                    operators: index.operators,
                    vocabulary: index.vocabulary,
                  },
                  {},
                  knex,
                );
              }
              // Update catalog table
              await knex.schema.alterTable('catalog', async (table) => {
                const field = `_${index.name}`;
                switch (index.type) {
                  case 'string':
                    table.string(field).index();
                    break;
                  case 'integer':
                    table.integer(field).index();
                    break;
                  case 'path':
                    table.string(field).index();
                    break;
                  case 'uuid':
                    table.uuid(field).index();
                    break;
                  case 'boolean':
                    table.boolean(field).index();
                    break;
                  case 'date':
                    table.dateTime(field).index();
                    break;
                  case 'string[]':
                    table
                      .specificType(field, 'character varying(255)[]')
                      .index();
                    break;
                  case 'uuid[]':
                    table.specificType(field, 'uuid[]').index();
                    break;
                  case 'text':
                    table.specificType(field, 'tsvector').index(null, 'GIN');
                    break;
                  default:
                    log.warn(`Unhandled index type: ${index.type}`);
                    break;
                }
              });
            }),
          );
          await Promise.all(
            map(profile.metadata, async (metadata) => {
              await knex.schema.alterTable('catalog', async (table) => {
                switch (metadata.type) {
                  case 'uuid':
                    table.uuid(metadata.name);
                    break;
                  case 'string':
                    table.string(metadata.name);
                    break;
                  case 'date':
                    table.dateTime(metadata.name);
                    break;
                  case 'integer':
                    table.integer(metadata.name);
                    break;
                  case 'boolean':
                    table.boolean(metadata.name);
                    break;
                  case 'string[]':
                    table.specificType(
                      metadata.name,
                      'character varying(255)[]',
                    );
                    break;
                  default:
                    log.warn(`Unhandled index type: ${metadata.type}`);
                    break;
                }
              });
            }),
          );
        }
      }),
    );
    log.info('Catalog imported');
  } catch (err) {
    log.error(err);
  }
};
