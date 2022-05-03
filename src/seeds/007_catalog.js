import { map } from 'lodash';

import { log, stripI18n } from '../helpers';
import { Catalog } from '../models';

export const seed = async (knex) => {
  try {
    const profile = stripI18n(require('../profiles/catalog'));
    await Promise.all(
      map(profile.indexes, async (index) => {
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
              table.specificType(field, 'character varying(255)[]').index();
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
              table.specificType(metadata.name, 'character varying(255)[]');
              break;
            default:
              log.warn(`Unhandled index type: ${metadata.type}`);
              break;
          }
        });
      }),
    );
    log.info('Catalog imported');
  } catch (err) {
    log.error(err);
  }
};
