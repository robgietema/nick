import { dropRight } from 'es-toolkit/array';
import { merge } from 'es-toolkit/object';
import { promises as fs } from 'fs';

import { dirExists } from '../../helpers/fs/fs';
import { handleFiles, handleImages } from '../../helpers/content/content';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';
import { Controlpanel } from '../../models/controlpanel/controlpanel';

export const seedControlpanel = async (trx, profilePath) => {
  if (dirExists(`${profilePath}/controlpanels`)) {
    // Get controlpanel profiles
    const controlpanels = (await fs.readdir(`${profilePath}/controlpanels`))
      .filter((file) => file.endsWith('.json'))
      .map((file) => dropRight(file.split('.'), 1).join('.'))
      .sort();

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
