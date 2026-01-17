import events from '../../events';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { config } = await import(`${process.cwd()}/config`);

export type ConfigSettings = {
  connection: {
    port: number;
    host: string;
    database: string;
    user: string;
    password: string;
  };
  blobsDir: string;
  localesDir: string;
  port: number;
  secret: string;
  systemUsers: string[];
  systemGroups: string[];
  cors: {
    allowOrigin: string;
    allowMethods: string;
    allowHeaders: string;
    allowCredentials: boolean;
    exposeHeaders: string;
    maxAge: number;
  };
  imageScales: Record<string, [number, number]>;
  frontendUrl: string;
  prefix: string;
  userRegistration: boolean;
  profiles: string[];
  rateLimit: {
    api: number;
    auth: number;
    trustProxy: number;
  };
  events: typeof events;
  ai: {
    models: {
      embed: {
        name: string;
        api: string;
        dimensions: number;
        minSimilarity: number;
        enabled: boolean;
      };
      llm: {
        name: string;
        api: string;
        contextSize: number;
        enabled: boolean;
      };
      vision: {
        name: string;
        api: string;
        enabled: boolean;
      };
    };
  };
  behaviors?: Record<string, unknown>;
};

export type ConfigType = InstanceType<typeof Config>;

const {
  ALLOWED_ORIGINS,
  API_RATE_LIMIT,
  AUTH_RATE_LIMIT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  SECRET,
  TRUST_PROXY,
  BLOBS_DIR,
  LOCALES_DIR,
} = process.env;

class Config {
  public settings: ConfigSettings;
  static instance: ConfigType;

  constructor() {
    this.settings = {
      connection: {
        port: parseInt(DB_PORT || config.connection.port || '5432'),
        host: DB_HOST || config.connection.host || 'localhost',
        database: DB_NAME || config.connection.database || 'nick',
        user: DB_USER || config.connection.user || 'nick',
        password: DB_PASSWORD || config.connection.password || 'nick',
      },
      blobsDir:
        BLOBS_DIR || config.blobsDir || `${__dirname}/../../../var/blobstorage`,
      localesDir:
        LOCALES_DIR || config.localesDir || `${__dirname}/../../../locales`,
      port: config.port || 8080,
      secret: SECRET || config.secret || 'secret',
      systemUsers: config.systemUsers || ['admin', 'anonymous'],
      systemGroups: config.systemGroups || ['Owner'],
      cors: {
        allowOrigin:
          ALLOWED_ORIGINS || config.cors.allowOrigin || 'http://localhost:3000',
        allowMethods:
          config.cors.allowMethods || 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowHeaders:
          config.cors.allowHeaders || 'Content-Type,Authorization,Accept',
        allowCredentials: config.cors.allowCredentials || true,
        exposeHeaders:
          config.cors.exposeHeaders || 'Content-Length,Content-Type',
        maxAge: config.cors.maxAge || 3600,
      },
      imageScales: config.imageScales || {
        large: [768, 768],
        preview: [400, 400],
        mini: [200, 200],
        thumb: [128, 128],
        tile: [64, 64],
        icon: [32, 32],
        listing: [16, 16],
      },
      frontendUrl: config.frontendUrl || 'http://localhost:3000',
      prefix: config.prefix || '',
      userRegistration: config.userRegistration || false,
      profiles: config.profiles || [
        `${__dirname}/src/profiles/core`,
        `${__dirname}/src/profiles/default`,
      ],
      rateLimit: {
        api: parseInt(API_RATE_LIMIT || config.rateLimit.api || '100'),
        auth: parseInt(AUTH_RATE_LIMIT || config.rateLimit.auth || '5'),
        trustProxy: parseInt(TRUST_PROXY || config.rateLimit.trustProxy || '1'),
      },
      events: config.events || events,
      ai: config.ai || {
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
    if (!Config.instance) {
      Config.instance = this;
    }

    return Config.instance;
  }
}

const instance = new Config();
export default instance;
