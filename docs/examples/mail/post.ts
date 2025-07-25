import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.sendEmail({
  token: login.data.token,
  data: {
    name: 'John Doe',
    from: 'john@doe.com',
    subject: 'Hello!',
    message: 'Just want to say hi.',
  },
});
