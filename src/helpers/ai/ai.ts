/**
 * AI helper.
 * @module helpers/ai/ai
 */

import type { Knex } from 'knex';

import { Catalog } from '../../models/catalog/catalog';
import type { Request } from '../../types';

const { config } = require(`${process.cwd()}/config`);

/**
 * Embed
 * @method embed
 * @param {string} input Value to be embedded
 * @returns {string} Vector of input value
 */
export async function embed(input: string): Promise<string> {
  const response = await fetch(config.ai.models.embed.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai.models.embed.name,
      input,
    }),
  });
  const data = await response.json();
  return JSON.stringify(data.embeddings[0]);
}

/**
 * Generate
 * @method generate
 * @param {string} prompt Prompt to be used for generation
 * @param {string} context Context to be used for generation
 * @returns {string} response
 */
export async function generate(
  prompt: string,
  context: string,
): Promise<string> {
  const response = await fetch(config.ai.models.generate.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai.models.generate.name,
      prompt: `Query: ${prompt}\nContext: ${context}\nPlease provide an answer and use the given context if you can't find the answer.`,
      stream: false,
    }),
  });
  return await response.json();
}
