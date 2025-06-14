---
nav_order: 1
permalink: /usage/installation
parent: Usage
---

# Installation

## Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Yeoman Generator

If you want to create your own project using Nick you can use the Yeoman generator package. This way you are able to customize your project without making changes to the core of Nick.

## Install dependencies

First, install [Yeoman](http://yeoman.io), @robgietema/generator-nick and [Yarn](https://classic.yarnpkg.com/en/) using [npm](https://www.npmjs.com/) (we assume you have pre-installed [Node.js](https://nodejs.org/)).

```shell
$ npm install -g yo
$ npm install -g @robgietema/generator-nick
$ npm install -g yarn
```

## Creating a new project

```shell
$ yo @robgietema/nick my-nick-project
```

This will bootstrap a new Nick project inside the current folder.

## Create Database

Connect to the PostgreSQL console and create a database and a user with the correct permission using the following commands:

```sql
CREATE DATABASE "my-nick-project";
CREATE USER "my-nick-project" WITH ENCRYPTED PASSWORD 'my-nick-project';
GRANT ALL PRIVILEGES ON DATABASE "my-nick-project" TO "my-nick-project";
ALTER DATABASE "my-nick-project" OWNER TO "my-nick-project";
```

## Boostrap the project

Bootstrap the project using the following commands:

```shell
$ cd my-nick-project
$ yarn bootstrap
$ yarn start
```

## Testing

```shell
$ yarn test
```
