/**
 * Generate routes.
 * @module routes/generate/generate
 */

import { concat, join, map, uniq } from 'lodash';

import { Catalog } from '../../models/catalog/catalog';
import { embed, generate } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

export default [
  {
    op: 'post',
    view: '/@generate',
    permission: 'View',
    client: 'generate',
    handler: async (req, trx) => {
      // Check if required field provided
      if (!req.body.prompt) {
        throw new RequestException(400, {
          message: req.i18n('Prompt is a required field.'),
        });
      }

      // Check if ai enabled
      if (!config.ai?.enabled) {
        throw new RequestException(400, {
          message: req.i18n('AI is disabled.'),
        });
      }

      // Find user, groups and roles
      const userGroupsRoles = uniq(
        concat(
          [req.user.id],
          req.user._groups.map((groups) => groups.id),
          req.user.getRoles(),
        ),
      );

      // Get embedding vector
      const embedding = await embed(req.body.prompt);

      // Fetch catalog items with closest embeddings
      const knex = Catalog.knex();
      const result = await knex
        .raw(
          `select "SearchableText", 1 - (_embedding <=> '${embedding}') AS similarity
            from catalog
            where "_allowedUsersGroupsRoles" && '{${userGroupsRoles.join(',')}}'
            order by similarity desc
            limit ${config.ai.models.generate.contextSize};`,
        )
        .transacting(trx);

      // Generate context from the results
      const context = join(
        map(result.rows, (row) => row.SearchableText),
        ' ',
      );

      return {
        json: await generate(req.body.prompt, context),
      };
    },
  },
];
