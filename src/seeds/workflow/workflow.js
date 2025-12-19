import { map, merge } from 'lodash';

import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Workflow } from '../../models/workflow/workflow';

export const seedWorkflow = async (trx, profilePath) => {
  if (fileExists(`${profilePath}/workflows`)) {
    const profile = stripI18n(require(`${profilePath}/workflows`));
    if (profile.purge) {
      await Workflow.delete({}, trx);
    }
    await Promise.all(
      map(profile.workflows, async (workflow) => {
        // Check if type exists
        const current = await Workflow.fetchById(workflow.id, {}, trx);

        // If doesn't exist
        if (!current) {
          await Workflow.create(workflow, {}, trx);
        } else {
          await Workflow.update(
            workflow.id,
            merge(current.$toDatabaseJson(), workflow),
            trx,
          );
        }
      }),
    );
    console.log('Workflows imported');
  }
};
