---
layout: default
nav_exclude: true
---

# Nick: Nearly Headless CMS

## Introduction

[Nick](http://nickcms.org) is a (nearly) headless CMS written in Node.js which provides a RESTful hypermedia API. The API is compatible with the [REST API](https://plonerestapi.readthedocs.io/en/latest/) of the [Plone CMS](http://plone.org) and can be used together with the web frontend [Volto](https://voltocms.com/).

## Documentation

[https://docs.nickcms.org](https://docs.nickcms.org)

## Getting started

A live demo of Nick with the latest release is available at:

[https://demo.nickcms.org](https://demo.nickcms.org)

Example `GET` request on the portal root

    curl -i https://demo.nickcms.org -H "Accept: application/json"

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Yeoman Generator

If you want to create your own project using Nick you can use the Yeoman generator package. This way you are able to customize your project without making changes to the core of Nick.

### Install dependencies

First, install [Yeoman](http://yeoman.io), @robgietema/generator-nick and [Yarn](https://classic.yarnpkg.com/en/) using [npm](https://www.npmjs.com/) (we assume you have pre-installed [Node.js](https://nodejs.org/)).

    $ npm install -g yo
    $ npm install -g @robgietema/generator-nick
    $ npm install -g yarn

### Creating a new project

    $ yo @robgietema/nick my-nick-project

This will bootstrap a new Nick project inside the current folder.

### Create Database

Connect to the PostgreSQL console and create a database and a user with the correct permission using the following commands:

    $ CREATE DATABASE "my-nick-project";
    $ CREATE USER "my-nick-project" WITH ENCRYPTED PASSWORD 'my-nick-project';
    $ GRANT ALL PRIVILEGES ON DATABASE "my-nick-project" TO "my-nick-project";
    $ ALTER DATABASE "my-nick-project" OWNER TO "my-nick-project";

### Boostrap the project

Bootstrap the project using the following commands:

    $ cd my-nick-project
    $ yarn bootstrap
    $ yarn start

### Testing

    $ yarn test

## AI Support

Some endpoints require an AI model to function, if this is the case it is specified in the endpoint documentation. You can use existing services or run the modals locally.

### Install local AI models

To run the models locally you start by install [Ollama](https://ollama.com). When Ollama is installed you need an Embedding Model and a Large Language Model. For this example we will use `nomic-embed-text` and `llama3.2` but you can use any model you want. To install the models use the following commands:

    $ ollama pull nomic-embed-text
    $ ollama pull llama3.2

### Install PostgreSQL extension

To store the embedding of words in vectors we will use the [pgvector](https://github.com/pgvector/pgvector) PostgreSQL extension. Follow the instruction on their website to install this extension. Once installed enable the extension by typing the following command in the PostgreSQL console:

    $ CREATE EXTENSION IF NOT EXISTS vector;

### Setup the config

Next step is setup the AI models in the config. You can do so by adding following settings to your `config.js` file:

```
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

## Development

To develop the core of Nick use the following steps to get started.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Create Database

    $ CREATE DATABASE "nick";
    $ CREATE USER "nick" WITH ENCRYPTED PASSWORD 'nick';
    $ GRANT ALL PRIVILEGES ON DATABASE "nick" TO "nick";
    $ ALTER DATABASE "nick" OWNER TO "nick";

### Get the code

    $ git clone git@github.com:robgietema/nick.git
    $ cd nick

### Bootstrap Project

    $ yarn install
    $ yarn bootstrap

### Run backend

    $ yarn start

### Testing

    $ yarn test

## Contribute

- Issue tracker: [https://github.com/robgietema/nick/issues](https://github.com/robgietema/nick/issues)
- Source Code: [https://github.com/robgietema/nick](https://github.com/robgietema/nick)
- Documentation [https://docs.nickcms.org](https://docs.nickcms.org)

## Support

If you are having issues, please let us know via the [issue tracker](https://github.com/robgietema/nick/issues).

## License

The project is licensed under the MIT License.
