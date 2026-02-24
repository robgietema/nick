import type { Knex } from 'knex';
import { merge } from 'es-toolkit/object';

import { fileExists } from '../../helpers/fs/fs';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Workflow } from '../../models/workflow/workflow';

export const seedWorkflow = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  if (fileExists(`${profilePath}/workflows`)) {
    const profile = stripI18n(
      (await import(`${profilePath}/workflows`)).default,
    );
    if (profile.purge) {
      await Workflow.delete({}, trx);
    }
    await Promise.all(
      profile.workflows.map(async (workflow: any) => {
        // Check if type exists
        const current: any = await Workflow.fetchById(workflow.id, {}, trx);

        // If doesn’t exist
        if (!current) {
          await Workflow.create(workflow, {}, trx);
        } else {
          await Workflow.update(
            workflow.id,
            merge((current as any).$toDatabaseJson(), workflow),
            trx,
          );
        }
      }),
    );
    console.log('Workflows imported');
  }
};
