import type { Knex } from 'knex';
import { fileExists } from '../../helpers/fs/fs';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Action } from '../../models/action/action';

export const seedAction = async (
  trx: Knex.Transaction,
  profilePath: string,
): Promise<void> => {
  if (fileExists(`${profilePath}/actions`)) {
    const profile = stripI18n((await import(`${profilePath}/actions`)).default);
    if (profile.purge) {
      await Action.delete({}, trx);
    }
    await mapAsync(
      ['object', 'site_actions', 'object_buttons', 'user'],
      async (category: string) => {
        await mapAsync(
          profile[category],
          async (action: any, index: number) => {
            await Action.create(
              {
                ...action,
                category,
                order: action.order || index,
              },
              {},
              trx,
            );
          },
        );
      },
    );
    console.log('Actions imported');
  }
};
