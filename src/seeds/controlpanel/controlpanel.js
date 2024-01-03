import { dropRight, map, merge } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, mapAsync, stripI18n } from '../../helpers';
import { Controlpanel } from '../../models';

export const seedControlpanel = async (knex, profilePath) => {
  try {
    if (dirExists(`${profilePath}/controlpanels`)) {
      // Get controlpanel profiles
      const controlpanels = map(
        await fs.readdir(`${profilePath}/controlpanels`),
        (file) => dropRight(file.split('.')).join('.'),
      ).sort();

      // Import controlpanels
      await mapAsync(controlpanels, async (controlpanel) => {
        const data = stripI18n(
          require(`${profilePath}/controlpanels/${controlpanel}`),
        );

        // Check if controlpanel exists
        const current = await Controlpanel.fetchById(data.id);

        // If doesn't exist
        if (!current) {
          await Controlpanel.create(data, {}, knex);
        } else {
          await Controlpanel.update(
            data.id,
            merge(current.$toDatabaseJson(), data),
            knex,
          );
        }
      });
      console.log('Controlpanels imported');
    }
  } catch (err) {
    console.log(err);
  }
};
