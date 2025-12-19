import { dropRight, map, merge } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists } from '../../helpers/fs/fs';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Behavior } from '../../models/behavior/behavior';
import { Type } from '../../models/type/type';

export const seedType = async (trx, profilePath) => {
  if (dirExists(`${profilePath}/behaviors`)) {
    // Get behavior profiles
    const behaviors = map(
      await fs.readdir(`${profilePath}/behaviors`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import behaviors
    await mapAsync(behaviors, async (behavior) => {
      const data = stripI18n(require(`${profilePath}/behaviors/${behavior}`));
      await Behavior.create(data, {}, trx);
    });
    console.log('Behaviors imported');
  }

  if (dirExists(`${profilePath}/types`)) {
    // Get type profiles
    const types = map(await fs.readdir(`${profilePath}/types`), (file) =>
      dropRight(file.split('.')).join('.'),
    ).sort();

    // Import types
    await mapAsync(types, async (type) => {
      let typeModel;
      const data = stripI18n(require(`${profilePath}/types/${type}`));

      // Check if type exists
      const current = await Type.fetchById(data.id, {}, trx);

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
          merge(current.$toDatabaseJson(), data),
          trx,
        );
      }

      await typeModel.cacheSchema(trx);
    });
    console.log('Types imported');
  }
};
