import type { Knex } from 'knex';
import { dropRight } from 'es-toolkit/array';
import { merge } from 'es-toolkit/object';
import { promises as fs } from 'fs';

import { dirExists } from '../../helpers/fs/fs';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Behavior } from '../../models/behavior/behavior';
import { Type } from '../../models/type/type';

export const seedType = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  if (dirExists(`${profilePath}/behaviors`)) {
    // Get behavior profiles
    const behaviors = (await fs.readdir(`${profilePath}/behaviors`))
      .map((file: string) => dropRight(file.split('.'), 1).join('.'))
      .sort();

    // Import behaviors
    await mapAsync(behaviors, async (behavior: string) => {
      const data = stripI18n(
        (await import(`${profilePath}/behaviors/${behavior}`)).default,
      );
      await Behavior.create(data, {}, trx);
    });
    console.log('Behaviors imported');
  }

  if (dirExists(`${profilePath}/types`)) {
    // Get type profiles
    const types = (await fs.readdir(`${profilePath}/types`))
      .map((file: string) => dropRight(file.split('.'), 1).join('.'))
      .sort();

    // Import types
    await mapAsync(types, async (type: string) => {
      let typeModel: any;
      const data = stripI18n(
        (await import(`${profilePath}/types/${type}`)).default,
      );

      // Check if type exists
      const current: any = await Type.fetchById(data.id, {}, trx);

      // If doesn't exist
      if (!current) {
        typeModel = await Type.create(
          {
            global_allow: true,
            filter_content_types: false,
            ...data,
          },
          {},
          trx,
        );
      } else {
        typeModel = await Type.update(
          data.id,
          merge((current as any).$toDatabaseJson(), data),
          trx,
        );
      }

      await typeModel.cacheSchema(trx);
    });
    console.log('Types imported');
  }
};
