import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ username: 'admin', password: 'admin' });

cli.createContent({
  path: '/news',
  data: {
    '@type': 'Page',
    title: 'My News Item',
    description: 'News Description',
  },
});
