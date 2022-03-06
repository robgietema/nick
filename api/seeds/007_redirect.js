exports.seed = (knex) =>
  knex('redirect')
    .del()
    .then(() =>
      knex('redirect').insert([
        {
          path: '/redir',
          redirect: '/news',
        },
      ]),
    );
