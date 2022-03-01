exports.seed = (knex) =>
  knex('role')
    .del()
    .then(() =>
      knex('role').insert([
        {
          id: 'Anonymous',
        },
        {
          id: 'Authenticated',
        },
        {
          id: 'Owner',
        },
        {
          id: 'Manager',
        },
        {
          id: 'Contributer',
        },
        {
          id: 'Editor',
        },
        {
          id: 'Reviewer',
        },
        {
          id: 'Reader',
        },
      ]),
    );
