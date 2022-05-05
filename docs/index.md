---
layout: default
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

- [Node.js==16.x.x](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Create Database

    $ CREATE DATABASE nick;
    $ CREATE USER nick WITH ENCRYPTED PASSWORD 'nick';
    $ GRANT ALL PRIVILEGES ON DATABASE nick TO nick;

### Bootstrap Installation

    $ yarn bootstrap

## Development

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
