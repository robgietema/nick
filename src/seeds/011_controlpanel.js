import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { log, mapAsync, stripI18n } from '../helpers';
import { Controlpanel } from '../models';

export const seed = async (knex) => {
  try {
    // Get controlpanel profiles
    const controlpanels = map(
      await fs.readdir(`${__dirname}/../profiles/controlpanels`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import controlpanels
    await mapAsync(controlpanels, async (controlpanel) => {
      const data = stripI18n(
        require(`../profiles/controlpanels/${controlpanel}`),
      );
      await Controlpanel.create(data, {}, knex);
    });
    log.info('Controlpanels imported');
  } catch (err) {
    log.error(err);
  }
};
