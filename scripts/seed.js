/* eslint no-console: 0 */
/**
 * Seed script.
 * @module scripts/seed
 */

import { last, padEnd } from 'lodash';

import { Profile } from '../src/models';
import { fileExists, knex, mapAsync, stripI18n } from '../src/helpers';

import {
  seedProfile,
  seedPermission,
  seedRole,
  seedGroup,
  seedUser,
  seedWorkflow,
  seedType,
  seedCatalog,
  seedDocument,
  seedRedirect,
  seedAction,
  seedControlpanel,
  seedVocabulary,
} from '../src/seeds';

const { config } = require(`${process.cwd()}/config`);

const reset = '\x1b[0m';
const underline = '\x1b[4m';

const seed = async (knex, profilePath) => {
  await seedProfile(knex, profilePath);
  await seedPermission(knex, profilePath);
  await seedRole(knex, profilePath);
  await seedGroup(knex, profilePath);
  await seedUser(knex, profilePath);
  await seedWorkflow(knex, profilePath);
  await seedType(knex, profilePath);
  await seedCatalog(knex, profilePath);
  await seedDocument(knex, profilePath);
  await seedRedirect(knex, profilePath);
  await seedAction(knex, profilePath);
  await seedControlpanel(knex, profilePath);
  await seedVocabulary(knex, profilePath);
};

/**
 * Main function
 * @function main
 * @return {undefined}
 */
async function main() {
  const command = last(process.argv);

  await mapAsync(config.profiles, async (profilePath, index) => {
    if (fileExists(`${profilePath}/metadata`)) {
      const metadata = stripI18n(require(`${profilePath}/metadata`));
      const profile = await Profile.fetchOne({ id: metadata.id }, {}, knex);

      switch (command) {
        case 'status':
          if (index === 0) {
            console.log(
              `${padEnd(`${underline}Profile${reset}`, 58)}${padEnd(
                `${underline}Current${reset}`,
                18,
              )}${padEnd(`${underline}Latest${reset}`, 18)}`,
            );
          }
          console.log(
            `${padEnd(metadata.id, 50)}${padEnd(
              profile ? profile.version : 'Not found',
              10,
            )}${padEnd(metadata.version, 10)}`,
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
                return await seed(knex, `${profilePath}/upgrades/${version}`);
              },
            );
          }
          break;
        default:
          console.log(`Applying profile ${metadata.id}`);
          if (profile && metadata.version === parseInt(profile.version)) {
            console.log('Profile already up to date');
          } else {
            return await seed(knex, profilePath);
          }
          break;
      }
    }
  });

  // Disconnect from db
  knex.destroy();
}

main();
