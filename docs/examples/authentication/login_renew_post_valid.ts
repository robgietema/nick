import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ data: { username: 'admin', password: 'admin' } });

const { data } = await cli.loginRenew();
