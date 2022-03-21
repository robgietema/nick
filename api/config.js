export default {
  connection: {
    port: 5432,
    host: 'localhost',
    database: 'isometric',
    user: 'isometric',
    password: 'isometric',
  },
  blobsDir: `${__dirname}/blobs`,
  port: 8000,
  secret: 'secret',
  systemUsers: ['admin', 'anonymous'],
  systemGroups: ['Authenticated', 'Owner'],
};
