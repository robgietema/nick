exports.seed = async (knex) => {
  await knex('group').del();
  await knex('group').insert([
    {
      uuid: '595efb73-cbdd-4bef-935a-156f70a20854',
      id: 'authenticated',
      groupname: 'Authenticated',
    },
    {
      uuid: '595efb73-cbdd-4bef-935a-256f70a20854',
      id: 'owner',
      groupname: 'Owner',
    },
  ]);
};
