import { map } from 'lodash';

import { fileExists, log, stripI18n } from '../helpers';
import { Workflow } from '../models';

const { config } = require(`${process.cwd()}/config`);

export const seed = async (knex) => {
  try {
    await Promise.all(
      map(config.profiles, async (profilePath) => {
        if (fileExists(`${profilePath}/workflows`)) {
          const profile = stripI18n(require(`${profilePath}/workflows`));
          if (profile.purge) {
            await Workflow.delete(knex);
          }
          await Promise.all(
            map(
              profile.workflows,
              async (workflow) => await Workflow.create(workflow, {}, knex),
            ),
          );
          log.info('Workflows imported');
        }
      }),
    );
  } catch (err) {
    log.error(err);
  }
};
