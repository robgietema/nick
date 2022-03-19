const bcrypt = require('bcrypt-promise');

exports.seed = async (knex) => {
  const password = await bcrypt.hash('admin', 10);
  await knex('user').del();
  await knex('user').insert([
    {
      uuid: '595efb73-cbdd-4bef-935a-a56f70a20854',
      id: 'admin',
      password,
      fullname: 'Admin',
      email: '',
    },
    {
      uuid: '695efb73-cbdd-4bef-935a-a56f70a20854',
      id: 'anonymous',
      password,
      fullname: 'Anonymous',
      email: '',
    },
  ]);
};
