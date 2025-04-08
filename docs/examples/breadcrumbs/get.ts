import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });

cli.getBreadcrumbs({ path: '/events/event-1' });
