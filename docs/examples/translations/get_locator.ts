import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.getTranslationLocation({
  token: login.data.token,
  path: '/en/events',
  query: {
    target_language: 'nl',
  },
});
