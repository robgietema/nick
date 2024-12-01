import { dropRight, endsWith, filter, map, merge } from 'lodash';
import { promises as fs } from 'fs';

import {
  dirExists,
  handleFiles,
  handleImages,
  mapAsync,
  stripI18n,
} from '../../helpers';
import { Controlpanel } from '../../models';

export const seedControlpanel = async (trx, profilePath) => {
  if (dirExists(`${profilePath}/controlpanels`)) {
    // Get controlpanel profiles
    const controlpanels = map(
      filter(await fs.readdir(`${profilePath}/controlpanels`), (file) =>
        endsWith(file, '.json'),
      ),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import controlpanels
    await mapAsync(controlpanels, async (controlpanel) => {
      let data = stripI18n(
        require(`${profilePath}/controlpanels/${controlpanel}`),
      );

      // Check if controlpanel exists
      let current = await Controlpanel.fetchById(data.id, {}, trx);

      // Create control panel if not already there
      if (!current) {
        await Controlpanel.create(data, {}, trx);
      }
      current = await Controlpanel.fetchById(data.id, {}, trx);

      // Handle files and images
      data.data = await handleFiles(
        data.data,
        current,
        `${profilePath}/controlpanels`,
      );
      data.data = await handleImages(
        data.data,
        current,
        `${profilePath}/controlpanels`,
      );

      // Update record
      await Controlpanel.update(
        data.id,
        merge(current.$toDatabaseJson(), data),
        trx,
      );
    });
    console.log('Controlpanels imported');
  }
};
