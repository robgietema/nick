/**
 * Generate routes.
 * @module routes/generate/generate
 */

import { has, join, omit } from 'lodash';

import { Catalog } from '../../models/catalog/catalog';
import { chat, embed, generate } from '../../helpers';

const { config } = require(`${process.cwd()}/config`);

const getEmbedFromPrompt = async (prompt, req, trx) => {
  // Get embedding vector
  const embedding = await embed(prompt);

  // Fetch catalog items with closest embeddings
  const result = await Catalog.fetchClosestEmbeddingRestricted(
    embedding,
    config.ai.models.llm.contextSize,
    trx,
    req,
  );

  // Generate contents from the results
  return join(
    result.map((item) => item.SearchableText),
    ' ',
  );
};

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

      return {
        json: await generate(req.body.prompt, req.body.context, {
          ...omit(req.body.params, ['Site']),
          ...(has(req.body.params, 'Site')
            ? { Site: await getEmbedFromPrompt(req.body.prompt, req, trx) }
            : {}),
        }),
      };
    },
  },
  {
    op: 'post',
    view: '/@chat',
    permission: 'View',
    client: 'chat',
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

      return {
        json: await chat(req.body.prompt, req.body.messages, {
          ...omit(req.body.params, ['Site']),
          ...(has(req.body.params, 'Site')
            ? { Site: await getEmbedFromPrompt(req.body.prompt, req, trx) }
            : {}),
        }),
      };
    },
  },
];
