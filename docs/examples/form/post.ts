import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
const login = await cli.login({ username: 'admin', password: 'admin' });

const { data } = await cli.postForm({
  token: login.data.token,
  path: '/@schemaform-data',
  data: {
    block_id: '669530d8-d319-48cc-ad4f-cd690ab7e472',
    data: {
      myfield: 'Lorem Ipsum',
    },
    captcha: {},
  },
});
