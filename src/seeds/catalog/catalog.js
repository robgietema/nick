import { fileExists, mapAsync, stripI18n } from '../../helpers';
import { Index } from '../../models';

export const seedCatalog = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/catalog`)) {
    const profile = stripI18n(require(`${profilePath}/catalog`));
    await mapAsync(profile.indexes, async (index) => {
      // Add index
      await Index.create(
        {
          id: `_${index.name}`,
          name: index.name,
          title: index.title,
          type: index.type,
          attr: index.attr,
          metadata: false,
          description: index.description,
          group: index.group,
          enabled: index.enabled,
          sortable: index.sortable,
          operators: index.operators,
          vocabulary: index.vocabulary,
        },
        {},
        trx,
      );
      // Update catalog table
      await trx.schema.alterTable('catalog', async (table) => {
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
            console.log(`Unhandled index type: ${index.type}`);
            break;
        }
      });
    });
    await mapAsync(profile.metadata, async (metadata) => {
      // Add index
      await Index.create(
        {
          id: metadata.name,
          name: metadata.name,
          type: metadata.type,
          attr: metadata.attr,
          metadata: true,
        },
        {},
        trx,
      );
      await trx.schema.alterTable('catalog', async (table) => {
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
          case 'json':
            table.json(metadata.name);
            break;
          case 'string[]':
            table.specificType(metadata.name, 'character varying(255)[]');
            break;
          default:
            console.log(`Unhandled index type: ${metadata.type}`);
            break;
        }
      });
    });
    console.log('Catalog imported');
  }
};
