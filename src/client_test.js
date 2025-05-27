import { Client } from './client.js';
import { knex } from './helpers';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });

cli.getBreadcrumbs({ path: '/events/event-1' }).then((res) => {
  console.log(res.data);
  knex.destroy();
  process.exit(0);
});
