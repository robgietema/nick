/**
 * Generate routes.
 * @module routes/generate/generate
 */

import { has, join, omit } from 'lodash';
import pdfParse from 'pdf-parse';

import { Catalog } from '../../models/catalog/catalog';
import {
  chat,
  embed,
  generate,
  streamChat,
  streamGenerate,
  RequestException,
} from '../../helpers';

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
  ).replace(/\n/g, ' ');
};

export default [
  {
    op: 'post',
    view: '/@generate',
    permission: 'View',
    client: 'generate',
    handler: async (req, trx, callback) => {
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

      let attachment = '';
      if (has(req.body.params, 'Attachment')) {
        const buffer = Buffer.from(req.body.params.Attachment, 'base64');
        const result = await pdfParse(buffer);
        attachment = result.text || '';
      }

      // Create params for the generation
      const params = {
        ...omit(req.body.params, ['Site', 'Attachment']),
        ...(has(req.body.params, 'Site')
          ? { Site: await getEmbedFromPrompt(req.body.prompt, req, trx) }
          : {}),
        ...(attachment ? { Attachment: attachment.replace(/\n/, '') } : {}),
      };

      if (req.body.stream === true) {
        streamGenerate(req.body.prompt, req.body.context, params, callback);
      } else {
        return {
          json: await generate(req.body.prompt, req.body.context, params),
        };
      }
    },
  },
  {
    op: 'post',
    view: '/@chat',
    permission: 'View',
    client: 'chat',
    handler: async (req, trx, callback) => {
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

      let attachment = '';
      if (has(req.body.params, 'Attachment')) {
        const buffer = Buffer.from(req.body.params.Attachment, 'base64');
        const result = await pdfParse(buffer);
        attachment = result.text || '';
      }

      // Create params for the generation
      const params = {
        ...omit(req.body.params, ['Site', 'Attachment']),
        ...(has(req.body.params, 'Site')
          ? { Site: await getEmbedFromPrompt(req.body.prompt, req, trx) }
          : {}),
        ...(attachment ? { Attachment: attachment.replace(/\n/, '') } : {}),
      };

      if (req.body.stream === true) {
        streamChat(
          req.body.prompt,
          req.body.messages,
          params,
          req.body.tools,
          callback,
        );
      } else {
        return {
          json: await chat(
            req.body.prompt,
            req.body.messages,
            params,
            req.body.tools,
          ),
        };
      }
    },
  },
];
