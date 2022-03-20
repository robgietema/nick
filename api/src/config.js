export default {
  connection: {
    port: 5432,
    host: 'localhost',
    database: 'isometric',
    user: 'isometric',
    password: 'isometric',
  },
  secret: 'secret',
  internalUsers: ['admin', 'anonymous'],
  internalGroups: ['Authenticated', 'Owner'],
};
