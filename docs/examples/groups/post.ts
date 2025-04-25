import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ username: 'admin', password: 'admin' });

cli.createGroup({
  groupname: 'nicks',
  title: 'Nicks',
  description: 'Nearly Headless Nicks',
  email: 'nearly.headless.nicks@example.com',
  roles: ['Contributor'],
});
