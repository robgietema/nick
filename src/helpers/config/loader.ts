import { autoConf, jsLoader, getConfigPath } from 'auto-config-loader';
import fs from 'fs';
import path from 'path';

type NickConfigSchema = {
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
  events: typeof import('../../events').default;
  routes: boolean;
  ai: {
    models: {
      embed: {
        name: string;
        api: string;
        dimensions: number;
      };
      llm: {
        name: string;
        api: string;
        contextSize: number;
      };
      vision: {
        name: string;
        api: string;
      };
    };
  };
};
type NickConfigJS = Partial<NickConfigSchema>;

/**
 * Gets the registry configuration from the project's config file (.js, .cjs, .ts, .mts).
 * It tries first if there's an environment variable pointing to the config file.
 * If it doesn't exist, it tries to load one from the local project.
 * If it doesn't exist, it returns an empty config object.
 */
export async function getNickConfig(projectRootPath: string) {
  const config: NickConfigJS = {};

  async function loadConfigFromEnvVar() {
    let config: NickConfigJS | null = null;
    const ENVVARCONFIG = ['NICKCONFIG', 'REGISTRYCONFIG'];
    for (const envVar of ENVVARCONFIG) {
      const envValue = process.env[envVar];
      if (!envValue) {
        continue;
      }
      const resolvedPath = path.resolve(envValue);
      if (fs.existsSync(resolvedPath)) {
        // @ts-expect-error It seems that the types are not correct in the auto-config-loader
        config = (await jsLoader(resolvedPath)).nick;
        console.log(
          `[@plone/registry] Using configuration file in: ${resolvedPath}`,
        );
        break;
      }
    }

    return config;
  }

  async function loadConfigFromNamespace(namespace: string) {
    let config: NickConfigJS | null = null;
    config = await autoConf(namespace, {
      cwd: projectRootPath,
      mustExist: true, // It seems that the bool is inverted
    });
    console.log(
      `[@plone/registry] Using configuration file in: ${getConfigPath()}`,
    );
    return config;
  }

  return (
    (await loadConfigFromEnvVar()) ||
    (await loadConfigFromNamespace('nick')) ||
    (await loadConfigFromNamespace('registry')) ||
    config
  );
}
