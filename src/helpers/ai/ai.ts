/**
 * AI helper.
 * @module helpers/ai/ai
 */

const { config } = require(`${process.cwd()}/config`);

import { map, keys } from 'lodash';

interface VisionResult {
  response: string;
}

interface Message {
  role: string;
  content: string;
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
 * @param {Array<number>} context Context to be used for generation
 * @param {Object} params Params to be used for generation
 * @returns {string} response
 */
export async function generate(
  prompt: string,
  context: Array<number>,
  params: any = {},
): Promise<string> {
  const response = await fetch(config.ai?.models?.llm?.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai?.models?.llm?.name,
      context,
      prompt: `Query: ${prompt}\n${map(keys(params), (key: string) => `${key}: ${params[key]}`)}\nPlease provide an answer to the question.`,
      stream: false,
      think: false,
    }),
  });
  return await response.json();
}

/**
 * Stream generate
 * @method streamGenerate
 * @param {string} prompt Prompt to be used for generation
 * @param {Array<number>} context Context to be used for generation
 * @param {Object} params Params to be used for generation
 * @param {Function|null} callback Callback function to be called with the response
 * @returns {string} response
 */
export function streamGenerate(
  prompt: string,
  context: Array<number>,
  params: any = {},
  callback: Function,
): undefined {
  fetch(config.ai?.models?.llm?.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai?.models?.llm?.name,
      context,
      prompt: `Query: ${prompt}\n${map(keys(params), (key: string) => `${key}: ${params[key]}`)}\nPlease provide an answer to the question.`,
      stream: true,
      think: false,
    }),
  }).then(async (response: Response) => {
    const reader: any = response.body?.getReader();
    let readResult: any;
    readResult = await reader.read();
    while (!readResult.done) {
      const token = new TextDecoder().decode(readResult.value);
      readResult = await reader.read();
      callback(token);
    }
  });
}

/**
 * Chat
 * @method chat
 * @param {string} prompt Prompt to be used for generation
 * @param {Array<Message>} messages Message history
 * @param {Object} params Params to be used for generation
 * @param {Object} tools Tools to be used for generation
 * @returns {string} response
 */
export async function chat(
  prompt: string,
  messages: Array<Message> = [],
  params: any = {},
  tools: any = [],
): Promise<string> {
  const response = await fetch(config.ai?.models?.llm?.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai?.models?.llm?.name,
      messages: [
        ...messages,
        {
          role: 'user',
          content: `Query: ${prompt}\n${map(keys(params), (key: string) => `${key}: ${params[key]}`)}\nPlease provide an answer and use the given page and site content if needed.`,
        },
      ],
      tools,
      stream: false,
      think: false,
    }),
  });
  return await response.json();
}

/**
 * Stream chat
 * @method streamChat
 * @param {string} prompt Prompt to be used for generation
 * @param {Array<Message>} messages Message history
 * @param {Object} params Params to be used for generation
 * @param {Object} tools Tools to be used for generation
 * @param {Function|null} callback Callback function to be called with the response
 * @returns {string} response
 */
export function streamChat(
  prompt: string,
  messages: Array<Message> = [],
  params: any = {},
  tools: any = [],
  callback: Function,
): undefined {
  fetch(config.ai?.models?.llm?.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.ai?.models?.llm?.name,
      messages: [
        ...messages,
        {
          role: 'user',
          content: `Query: ${prompt}\n${map(keys(params), (key: string) => `${key}: ${params[key]}`)}\nPlease provide an answer and use the given page and site content if needed.`,
        },
      ],
      tools,
      stream: true,
      think: false,
    }),
  }).then(async (response: Response) => {
    const reader: any = response.body?.getReader();
    let readResult: any;
    readResult = await reader.read();
    while (!readResult.done) {
      const token = new TextDecoder().decode(readResult.value);
      readResult = await reader.read();
      callback(token);
    }
  });
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
