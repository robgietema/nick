import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.getTypes({
  token: login.data.token,
  headers: {
    'Accept-Language': 'nl',
  },
});
