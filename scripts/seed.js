/* eslint no-console: 0 */
/**
 * Seed script.
 * @module scripts/seed
 */

import { last } from 'es-toolkit/array';
import configHelper from '../src/helpers/config/config';
const { config } = require(`${process.cwd()}/config`);

configHelper.settings = config; // Set config for helpers

import { Profile } from '../src/models/profile/profile';
import { fileExists } from '../src/helpers/fs/fs';
import { knex } from '../src/helpers/knex/knex';
import { mapAsync } from '../src/helpers/utils/utils';
import { stripI18n } from '../src/helpers/i18n/i18n';

import { seedProfile } from '../src/seeds/profile/profile';
import { seedPermission } from '../src/seeds/permission/permission';
import { seedRole } from '../src/seeds/role/role';
import { seedGroup } from '../src/seeds/group/group';
import { seedUser } from '../src/seeds/user/user';
import { seedWorkflow } from '../src/seeds/workflow/workflow';
import { seedType } from '../src/seeds/type/type';
import { seedCatalog } from '../src/seeds/catalog/catalog';
import { seedDocument } from '../src/seeds/document/document';
import { seedRedirect } from '../src/seeds/redirect/redirect';
import { seedAction } from '../src/seeds/action/action';
import { seedControlpanel } from '../src/seeds/controlpanel/controlpanel';
import { seedVocabulary } from '../src/seeds/vocabulary/vocabulary';

const reset = '\x1b[0m';
const underline = '\x1b[4m';

const seed = async (trx, profilePath) => {
  await seedProfile(trx, profilePath);
  await seedPermission(trx, profilePath);
  await seedRole(trx, profilePath);
  await seedGroup(trx, profilePath);
  await seedUser(trx, profilePath);
  await seedWorkflow(trx, profilePath);
  await seedType(trx, profilePath);
  await seedCatalog(trx, profilePath);
  await seedDocument(trx, profilePath);
  await seedRedirect(trx, profilePath);
  await seedAction(trx, profilePath);
  await seedControlpanel(trx, profilePath);
  await seedVocabulary(trx, profilePath);
};

/**
 * Main function
 * @function main
 * @return {undefined}
 */
async function main() {
  const command = last(process.argv);
  const trx = await knex.transaction();

  try {
    await mapAsync(config.profiles, async (profilePath, index) => {
      if (fileExists(`${profilePath}/metadata`)) {
        const metadata = stripI18n(require(`${profilePath}/metadata`));
        const profile = await Profile.fetchOne({ id: metadata.id }, {}, trx);

        switch (command) {
          case 'status':
            if (index === 0) {
              console.log(
                `${`${underline}Profile${reset}`.padEnd(58)}${`${underline}Current${reset}`.padEnd(
                  18,
                )}${`${underline}Latest${reset}`.padEnd(18)}`,
              );
            }
            console.log(
              `${metadata.id.padEnd(50)}${(profile
                ? profile.version
                : 'Not found'
              ).padEnd(10)}${metadata.version.padEnd(10)}`,
            );
            break;
          case 'upgrade':
            if (!profile) {
              console.log('Profile is not installed yet');
            } else if (metadata.version === parseInt(profile.version)) {
              console.log('Profile already up to date');
            } else {
              return mapAsync(
                Array.apply(null, {
                  length: metadata.version - parseInt(profile.version),
                }),
                async (value, index) => {
                  const version = parseInt(profile.version) + 1 + index;
                  console.log(`Upgrading ${profilePath} to ${version}`);
                  return await seed(trx, `${profilePath}/upgrades/${version}`);
                },
              );
            }
            break;
          default:
            console.log(`Applying profile ${metadata.id}`);
            if (profile && metadata.version === parseInt(profile.version)) {
              console.log('Profile already up to date');
            } else {
              return await seed(trx, profilePath);
            }
            break;
        }
      }
    });

    // Commit changes
    await trx.commit();
    knex.destroy();
  } catch (err) {
    await trx.rollback();
    knex.destroy();
    console.log(err);
  }
}

main();
