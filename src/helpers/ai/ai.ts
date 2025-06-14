/**
 * AI helper.
 * @module helpers/ai/ai
 */

const { config } = require(`${process.cwd()}/config`);

interface VisionResult {
  response: string;
}

/**
 * Embed
 * @method embed
 * @param {string} input Value to be embedded
 * @returns {string} Vector of input value
 */
export async function embed(input: string): Promise<string> {
  const response = await fetch(config.ai?.models?.embed?.api, {
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
  const response = await fetch(config.ai?.models?.llm?.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai?.models?.llm?.name,
      prompt: `Query: ${prompt}\nContext: ${context}\nPlease provide an answer and use the given context if you can't find the answer.`,
      stream: false,
    }),
  });
  return await response.json();
}

/**
 * Vision
 * @method vision
 * @param {string} data Image data to be processed
 * @returns {VisionResult} response
 */
export async function vision(data: string): Promise<VisionResult> {
  const response = await fetch(config.ai?.models?.vision?.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai?.models?.vision?.name,
      prompt: 'What is in this picture?',
      images: [data],
      stream: false,
    }),
  });
  return await response.json();
}
