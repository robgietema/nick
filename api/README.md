# Isometric Backend

## Installation

### Prerequisites

- [Node.js==16.x.x](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Create Database

    $ CREATE DATABASE isometric;
    $ CREATE USER isometric WITH ENCRYPTED PASSWORD 'isometric';
    $ GRANT ALL PRIVILEGES ON DATABASE isometric TO isometric;
    $ CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

Make sure the isometric user has the privileges to run the last command.

### Install Dependencies

    $ yarn

## Development

### Create DB structure

    $ yarn migrate

### Import dummy content

    $ yarn seed

### Run backend

    $ yarn start

### Testing

    $ yarn test

## License

MIT License. Copyrights hold Rob Gietema.
See [LICENSE.md](LICENSE.md) for details.
