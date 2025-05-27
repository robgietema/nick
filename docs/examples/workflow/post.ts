import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.changeWorkflow({
  token: login.data.token,
  path: '/news/my-news-item',
  params: {
    id: 'publish',
  },
});
