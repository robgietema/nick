import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.search({
  token: login.data.token,
  query: {
    b_size: 3,
    b_start: 2,
  },
});
