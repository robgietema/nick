exports.seed = (knex) =>
  knex('permission')
    .del()
    .then(() =>
      knex('permission').insert([
        {
          id: 'View',
        },
        {
          id: 'Add',
        },
        {
          id: 'Modify',
        },
        {
          id: 'Review',
        },
        {
          id: 'Submit',
        },
      ]),
    );
