import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.generate({
  token: login.data.token,
  data: {
    prompt: 'What is the username of the nick demo site?',
  },
});
