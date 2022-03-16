exports.seed = (knex) =>
  knex('document')
    .del()
    .then(() =>
      knex('document').insert([
        {
          uuid: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'root',
          path: '/',
          created: '2022-02-27T16:00:00+00:00',
          modified: '2022-02-27T16:00:00+00:00',
          type: 'site',
          position_in_parent: 0,
          version: 0,
          lock: { locked: false, stealable: true },
          workflow_state: 'published',
          owner: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Welcome to Isometric',
            description:
              'Congratulations! You have successfully installed Isometric.',
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
          uuid: '5ba6ac12-2a02-40be-a76f-9067ce98ed47',
          parent: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'news',
          path: '/news',
          created: '2022-02-27T15:00:00+00:00',
          modified: '2022-02-27T16:00:00+00:00',
          type: 'folder',
          position_in_parent: 0,
          version: 1,
          lock: { locked: false, stealable: true },
          workflow_state: 'published',
          owner: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'News',
            description: 'News Items',
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
          uuid: '6ba6ac12-2a02-40be-a76f-9067ce98ed47',
          parent: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'events',
          path: '/events',
          created: '2022-02-27T16:00:00+00:00',
          modified: '2022-02-27T16:00:00+00:00',
          type: 'folder',
          position_in_parent: 1,
          version: 0,
          lock: { locked: false, stealable: true },
          workflow_state: 'published',
          owner: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Events',
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
          uuid: '7ba6ac12-2a02-40be-a76f-9067ce98ed47',
          parent: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
          id: 'users',
          path: '/users',
          created: '2022-02-27T16:00:00+00:00',
          modified: '2022-02-27T16:00:00+00:00',
          type: 'folder',
          position_in_parent: 2,
          version: 0,
          lock: { locked: false, stealable: true },
          workflow_state: 'published',
          owner: '595efb73-cbdd-4bef-935a-a56f70a20854',
          json: {
            title: 'Users',
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
