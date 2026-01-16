import events from '../../events';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
        port: parseInt(DB_PORT || '5432'),
        host: DB_HOST || 'localhost',
        database: DB_NAME || 'nick',
        user: DB_USER || 'nick',
        password: DB_PASSWORD || 'nick',
      },
      blobsDir: BLOBS_DIR || `${__dirname}/../../../var/blobstorage`,
      localesDir: LOCALES_DIR || `${__dirname}/../../../locales`,
      port: 8080,
      secret: SECRET || 'secret',
      systemUsers: ['admin', 'anonymous'],
      systemGroups: ['Owner'],
      cors: {
        allowOrigin: ALLOWED_ORIGINS || 'http://localhost:3000',
        allowMethods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        allowHeaders: 'Content-Type,Authorization,Accept',
        allowCredentials: true,
        exposeHeaders: 'Content-Length,Content-Type',
        maxAge: 3600,
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
      userRegistration: false,
      rateLimit: {
        api: parseInt(API_RATE_LIMIT || '100'),
        auth: parseInt(AUTH_RATE_LIMIT || '5'),
        trustProxy: parseInt(TRUST_PROXY || '1'),
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
    if (!Config.instance) {
      Config.instance = this;
    }

    return Config.instance;
  }
}

const instance = new Config();
export default instance;
