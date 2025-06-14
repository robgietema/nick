/**
 * Generate routes.
 * @module routes/generate/generate
 */

import { join } from 'lodash';

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
      if (
        !config.ai?.models?.embed?.enabled ||
        !config.ai?.models?.llm?.enabled
      ) {
        throw new RequestException(400, {
          message: req.i18n('AI is disabled.'),
        });
      }

      // Get embedding vector
      const embedding = await embed(req.body.prompt);

      // Fetch catalog items with closest embeddings
      const result = await Catalog.fetchClosestEmbeddingRestricted(
        embedding,
        config.ai.models.llm.contextSize,
        trx,
        req,
      );

      // Generate context from the results
      const context = join(
        result.map((item) => item.SearchableText),
        ' ',
      );

      return {
        json: await generate(req.body.prompt, context),
      };
    },
  },
];
