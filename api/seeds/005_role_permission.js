exports.seed = (knex) =>
  knex('role_permission')
    .del()
    .then(() =>
      knex('role_permission').insert([
        {
          role: 'Anonymous',
          permission: 'View',
        },
        {
          role: 'Authenticated',
          permission: 'View',
        },
        {
          role: 'Contributer',
          permission: 'Add',
        },
        {
          role: 'Manager',
          permission: 'Add',
        },
        {
          role: 'Owner',
          permission: 'Add',
        },
        {
          role: 'Editor',
          permission: 'Modify',
        },
        {
          role: 'Owner',
          permission: 'Modify',
        },
        {
          role: 'Manager',
          permission: 'Modify',
        },
        {
          role: 'Editor',
          permission: 'Delete',
        },
        {
          role: 'Owner',
          permission: 'Delete',
        },
        {
          role: 'Manager',
          permission: 'Delete',
        },
      ]),
    );
