import events from './src/events';

export const config = {
  connection: {
    port: 5432,
    host: 'localhost',
    database: '<%= projectName %>',
    user: '<%= projectName %>',
    password: '<%= projectName %>',
  },
  blobsDir: `${__dirname}/var/blobstorage`,
  port: 8080,
  secret: 'secret',
  systemUsers: ['admin', 'anonymous'],
  systemGroups: ['Owner'],
  cors: {
    allowOrigin: '*',
    allowMethods: '*',
    allowHeaders: '*',
    allowCredentials: true,
    exposeHeaders: '*',
    maxAge: 3660,
  },
  imageScales: {
    large: [768, 768],
    preview: [400, 400],
    mini: [200, 200],
    thumb: [128, 128],
    tile: [64, 64],
    icon: [32, 32],
    listing: [16, 16],
  },
  frontendUrl: 'http://localhost:3000',
  prefix: '',
  userRegistration: true,
  profiles: [
    `${__dirname}/src/develop/nick/src/profiles/core`,
    `${__dirname}/src/profiles/default`,
  ],
  requestLimit: {
    api: '1mb',
    files: '10mb',
  },
  rateLimit: {
    api: 100,
    auth: 5,
    trustProxy: 1,
  },
  events,
  ai: {
    models: {
      embed: {
        name: 'nomic-embed-text',
        api: 'http://localhost:11434/api/embed',
        dimensions: 768,
        minSimilarity: 0.5,
        enabled: false,
      },
      llm: {
        name: 'qwen3',
        api: 'http://localhost:11434/api/chat',
        contextSize: 10,
        enabled: false,
      },
      vision: {
        name: 'llava',
        api: 'http://localhost:11434/api/generate',
        enabled: false,
      },
    },
  },
};
