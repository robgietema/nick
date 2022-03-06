exports.seed = (knex) =>
  knex('version')
    .del()
    .then(() =>
      knex('version').insert([
        {
          version: 0,
          document: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'root',
          created: '2022-02-27T16:00:00+00:00',
          actor: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Welcome to Isometric',
            description:
              'Congratulations! You have successfully installed Isometric.',
            changeNote: 'Initial version',
            blocks: {
              '79ba8858-1dd3-4719-b731-5951e32fbf79': {
                '@type': 'title',
              },
              '495efb73-cbdd-4bef-935a-a56f70a20854': {
                '@type': 'text',
                text: {
                  blocks: [
                    {
                      key: '9f35d',
                      text: 'Congratulations! You have succesfully installed Isometric.',
                      type: 'unstyled',
                      depth: 0,
                      inlineStyleRanges: [],
                      entityRanges: [],
                      data: {},
                    },
                  ],
                  entityMap: {},
                },
              },
            },
            blocks_layout: {
              items: [
                '79ba8858-1dd3-4719-b731-5951e32fbf79',
                '495efb73-cbdd-4bef-935a-a56f70a20854',
              ],
            },
          },
        },
        {
          version: 0,
          document: '5ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'news',
          created: '2022-02-27T15:00:00+00:00',
          actor: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Old News',
            changeNote: 'Initial version',
            blocks: {
              '79ba8858-1dd3-4719-b731-5951e32fbf79': {
                '@type': 'title',
              },
            },
            blocks_layout: {
              items: ['79ba8858-1dd3-4719-b731-5951e32fbf79'],
            },
          },
        },
        {
          version: 1,
          document: '5ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'news',
          created: '2022-02-27T16:00:00+00:00',
          actor: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'News',
            changeNote: 'Changed title',
            blocks: {
              '79ba8858-1dd3-4719-b731-5951e32fbf79': {
                '@type': 'title',
              },
            },
            blocks_layout: {
              items: ['79ba8858-1dd3-4719-b731-5951e32fbf79'],
            },
          },
        },
        {
          version: 0,
          document: '6ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'events',
          created: '2022-02-27T16:00:00+00:00',
          actor: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Events',
            changeNote: 'Initial version',
            blocks: {
              '79ba8858-1dd3-4719-b731-5951e32fbf79': {
                '@type': 'title',
              },
            },
            blocks_layout: {
              items: ['79ba8858-1dd3-4719-b731-5951e32fbf79'],
            },
          },
        },
        {
          version: 0,
          document: '7ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'users',
          created: '2022-02-27T16:00:00+00:00',
          actor: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Users',
            changeNote: 'Initial version',
            blocks: {
              '79ba8858-1dd3-4719-b731-5951e32fbf79': {
                '@type': 'title',
              },
            },
            blocks_layout: {
              items: ['79ba8858-1dd3-4719-b731-5951e32fbf79'],
            },
          },
        },
      ]),
    );
