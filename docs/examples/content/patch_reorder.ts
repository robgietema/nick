import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ username: 'admin', password: 'admin' });

cli.orderContent({
  path: '/news',
  data: {
    obj_id: 'my-news-item',
    delta: 'top',
  },
});
