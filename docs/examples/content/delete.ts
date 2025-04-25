import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ username: 'admin', password: 'admin' });

cli.deleteContent({ path: '/news/my-news-item' });
