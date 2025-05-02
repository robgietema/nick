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

- [Node.js==22.x.x](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Create Database

    $ CREATE DATABASE nick;
    $ CREATE USER nick WITH ENCRYPTED PASSWORD 'nick';
    $ GRANT ALL PRIVILEGES ON DATABASE nick TO nick;

### Bootstrap Project

    $ yarn bootstrap

## Development

### Run backend

    $ yarn start

### Testing

    $ yarn test

## Yeoman Generator

If you want to create your own project and use Nick as a dependency you can use the Yeoman generator package for that. This way you are able to customize your project without making changes to the core of Nick.

### Installation

First, install [Yeoman](http://yeoman.io) and @robgietema/generator-nick using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

    $ npm install -g yo
    $ npm install -g @robgietema/generator-nick

### Creating a new project

    $ yo @robgietema/nick my-nick-project

This will bootstrap a new Nick project inside the current folder.

### Boostrap the project

Create a database and a user with the correct permissions for your project (see above for details) and then bootstrap Nick with:

    $ cd my-nick-project
    $ yarn bootstrap
    $ yarn start

## Docker image

Install [Docker Desktop](https://www.docker.com/get-started/).

### Backend

Navigate to the root of the repository, and run the following command to run the Docker container for backend.

```shell
docker compose up --build
```

This will expose port `8000`.
You can make requests to `http://localhost:8000/++api++/` to fetch content.

To shut down the containers, run the following command.

```shell
docker compose down
```

### Frontend

You can use any frontend.
For convenience, you can navigate to the directory `/frontend` and use the pre-built frontend.

## Contribute

- Issue tracker: [https://github.com/robgietema/nick/issues](https://github.com/robgietema/nick/issues)
- Source Code: [https://github.com/robgietema/nick](https://github.com/robgietema/nick)
- Documentation [https://docs.nickcms.org](https://docs.nickcms.org)

## Support

If you are having issues, please let us know via the [issue tracker](https://github.com/robgietema/nick/issues).

## License

MIT License. Copyrights hold Rob Gietema.
See [LICENSE.md](LICENSE.md) for details.
