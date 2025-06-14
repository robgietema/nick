---
nav_order: 7
permalink: /usage/ai
parent: Usage
---

# AI Support

Some endpoints require an AI model to function, if this is the case it is specified in the endpoint documentation. You can use existing services or run the modals locally.

## Install local AI models

To run the models locally you start by install [Ollama](https://ollama.com). When Ollama is installed you need an Embedding Model and a Large Language Model. For this example we will use `nomic-embed-text` and `llama3.2` but you can use any model you want. To install the models use the following commands:

```shell
$ ollama pull nomic-embed-text
$ ollama pull llama3.2
```

## Install PostgreSQL extension

To store the embedding of words in vectors we will use the [pgvector](https://github.com/pgvector/pgvector) PostgreSQL extension. Follow the instruction on their website to install this extension. Once installed enable the extension by typing the following command in the PostgreSQL console:

```shell
$ CREATE EXTENSION IF NOT EXISTS vector;
```

## Setup the config

Next step is setup the AI models in the config. You can do so by adding following settings to your `config.js` file:

```ts
export const config = {
  ...
  profiles: [
    `${__dirname}/src/profiles/core`,
    `${__dirname}/src/profiles/ai`,
    `${__dirname}/src/profiles/default`,
  ],
  ...
  ai: {
    enabled: true,
    models: {
      embed: {
        name: 'nomic-embed-text',
        api: 'http://localhost:11434/api/embed',
        dimensions: 768,
        minSimilarity: 0.75,
      },
      generate: {
        name: 'llama3.2',
        api: 'http://localhost:11434/api/generate',
        contextSize: 10,
      },
    },
  },
  ...
};
```

The `ai` profile adds 2 extra indexes. One is used to store the embedding of the content in a vector and the other is used to store the context which can be used when RAG is needed. When you choose another embedding model make sure the `dimensions` setting matches with your model. The `contextSize` parameters specifies how many documents are added to the context when using RAG.
