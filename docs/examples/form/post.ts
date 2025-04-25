import { Client } from '@robgietema/nick';

const cli = Client.initialize({ apiPath: 'http://localhost:8080' });
cli.login({ username: 'admin', password: 'admin' });

cli.postForm({
  path: '/@schemaform-data',
  data: {
    block_id: '669530d8-d319-48cc-ad4f-cd690ab7e472',
    data: {
      myfield: 'Lorem Ipsum',
    },
    captcha: {},
  },
});
