import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ username: 'admin', password: 'admin' });

const { data, status } = cli.getActions({ path: '/' });
