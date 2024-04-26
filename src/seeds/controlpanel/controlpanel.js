import { dropRight, map, merge } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, mapAsync, stripI18n } from '../../helpers';
import { Controlpanel } from '../../models';

export const seedControlpanel = async (trx, profilePath) => {
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
      const current = await Controlpanel.fetchById(data.id, {}, trx);

      // If doesn't exist
      if (!current) {
        await Controlpanel.create(data, {}, trx);
      } else {
        await Controlpanel.update(
          data.id,
          merge(current.$toDatabaseJson(), data),
          trx,
        );
      }
    });
    console.log('Controlpanels imported');
  }
};
