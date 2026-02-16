/**
 * Generate routes.
 * @module routes/generate/generate
 */

import { omit } from 'es-toolkit/object';
import { PDFParse } from 'pdf-parse';

import { Catalog } from '../../models/catalog/catalog';
import {
  chat,
  embed,
  generate,
  streamChat,
  streamGenerate,
} from '../../helpers/ai/ai';
import config from '../../helpers/config/config';

import { RequestException } from '../../helpers/error/error';

const getEmbedFromPrompt = async (prompt, req, trx) => {
  // Get embedding vector
  const embedding = await embed(prompt);

  // Fetch catalog items with closest embeddings
  const result = await Catalog.fetchClosestEmbeddingRestricted(
    embedding,
    config.settings.ai.models.llm.contextSize,
    trx,
    req,
  );

  // Generate contents from the results
  return result
    .map((item) => item.SearchableText)
    .join(' ')
    .replace(/\n/g, ' ');
};

export default [
  {
    op: 'post',
    view: '/@generate',
    permission: 'AI',
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
        !config.settings.ai?.models?.embed?.enabled ||
        !config.settings.ai?.models?.llm?.enabled
      ) {
        throw new RequestException(400, {
          message: req.i18n('AI is disabled.'),
        });
      }

      let attachment = '';
      if (Object.hasOwn(req.body.params, 'Attachment')) {
        const buffer = Buffer.from(req.body.params.Attachment, 'base64');
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        attachment = result.text || '';
      }

      // Create params for the generation
      const params = {
        ...omit(req.body.params, ['Site', 'Attachment']),
        ...(Object.hasOwn(req.body.params, 'Site')
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
    permission: 'AI',
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
        !config.settings.ai?.models?.embed?.enabled ||
        !config.settings.ai?.models?.llm?.enabled
      ) {
        throw new RequestException(400, {
          message: req.i18n('AI is disabled.'),
        });
      }

      let attachment = '';
      if (Object.hasOwn(req.body.params, 'Attachment')) {
        const buffer = Buffer.from(req.body.params.Attachment, 'base64');
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        attachment = result.text || '';
      }

      // Create params for the generation
      const params = {
        ...omit(req.body.params, ['Site', 'Attachment']),
        ...(Object.hasOwn(req.body.params, 'Site')
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
