exports.seed = (knex) =>
  knex('redirect')
    .del()
    .then(() =>
      knex('redirect').insert([
        {
          uuid: '5ca6ac12-2a02-40be-a76f-9067ce98ed47',
          document: '5ba6ac12-2a02-40be-a76f-9067ce98ed47',
          path: '/redir',
          redirect: '/news',
        },
      ]),
    );
