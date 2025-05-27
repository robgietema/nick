import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.linkTranslation({
  token: login.data.token,
  path: '/en/events',
  data: {
    id: '495efb73-cbdd-4bef-935a-a56f70a20854',
  },
});
