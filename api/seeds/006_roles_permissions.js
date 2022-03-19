exports.seed = async (knex) => {
  await knex('role').del();
  await knex('role').insert([
    {
      id: 'Reader',
      order: 0,
    },
    {
      id: 'Contributer',
      order: 1,
    },
    {
      id: 'Editor',
      order: 2,
    },
    {
      id: 'Reviewer',
      order: 3,
    },
    {
      id: 'Administrator',
      order: 4,
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
      role: 'Reader',
      permission: 'View',
    },
    {
      role: 'Contributer',
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
      role: 'Administrator',
      permission: 'Submit',
    },
    {
      role: 'Administrator',
      permission: 'Manage Users',
    },
  ]);
  await knex('user_role').del();
  await knex('user_role').insert([
    {
      user: '595efb73-cbdd-4bef-935a-a56f70a20854',
      role: 'Administrator',
    },
  ]);
  await knex('group_role').del();
  await knex('group_role').insert([
    {
      group: '595efb73-cbdd-4bef-935a-256f70a20854',
      role: 'Contributer',
    },
    {
      group: '595efb73-cbdd-4bef-935a-256f70a20854',
      role: 'Editor',
    },
    {
      group: '595efb73-cbdd-4bef-935a-156f70a20854',
      role: 'Reader',
    },
  ]);
};
