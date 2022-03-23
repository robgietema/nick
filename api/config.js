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
  imageScales: {
    large: [768, 768],
    preview: [400, 400],
    mini: [200, 200],
    thumb: [128, 128],
    tile: [64, 64],
    icon: [32, 32],
    listing: [16, 16],
  },
};
