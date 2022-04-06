# Nick: Nearly Headless CMS

## Installation

### Prerequisites

- [Node.js==16.x.x](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Create Database

    $ CREATE DATABASE nick;
    $ CREATE USER nick WITH ENCRYPTED PASSWORD 'nick';
    $ GRANT ALL PRIVILEGES ON DATABASE nick TO nick;
    $ CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

Make sure the nick user has the privileges to run the last command.

### Install Dependencies

    $ yarn

## Development

### Create DB structure

    $ yarn migrate

### Import initial content

    $ yarn seed

### Run backend

    $ yarn start

### Testing

    $ yarn test

## License

MIT License. Copyrights hold Rob Gietema.
See [LICENSE.md](LICENSE.md) for details.
