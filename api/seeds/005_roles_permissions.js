exports.seed = async (knex) => {
  await knex('role').del();
  await knex('role').insert([
    {
      id: 'Anonymous',
    },
    {
      id: 'Authenticated',
    },
    {
      id: 'Contributer',
    },
    {
      id: 'Editor',
    },
    {
      id: 'Owner',
    },
    {
      id: 'Reader',
    },
    {
      id: 'Reviewer',
    },
    {
      id: 'Administrator',
    },
  ]);
  await knex('permission').del();
  await knex('permission').insert([
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
    {
      id: 'Manage Users',
    },
  ]);
  await knex('role_permission').del();
  await knex('role_permission').insert([
    {
      role: 'Contributer',
      permission: 'Add',
    },
    {
      role: 'Owner',
      permission: 'Add',
    },
    {
      role: 'Administrator',
      permission: 'Add',
    },
    {
      role: 'Reviewer',
      permission: 'Review',
    },
    {
      role: 'Administrator',
      permission: 'Review',
    },
    {
      role: 'Editor',
      permission: 'Submit',
    },
    {
      role: 'Owner',
      permission: 'Submit',
    },
    {
      role: 'Administrator',
      permission: 'Submit',
    },
    {
      role: 'Administrator',
      permission: 'Manage Users',
    },
  ]);
  await knex('user_role_document').del();
  await knex('user_role_document').insert([
    {
      user: '595efb73-cbdd-4bef-935a-a56f70a20854',
      role: 'Administrator',
      document: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
    },
  ]);
};
