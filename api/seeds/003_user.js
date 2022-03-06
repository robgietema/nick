const bcrypt = require('bcrypt-promise');

exports.seed = (knex) =>
  bcrypt.hash('admin', 10).then((password) =>
    knex('user')
      .del()
      .then(() =>
        knex('user').insert([
          {
            uuid: '595efb73-cbdd-4bef-935a-a56f70a20854',
            id: 'admin',
            password,
            fullname: 'Admin',
          },
          {
            uuid: '695efb73-cbdd-4bef-935a-a56f70a20854',
            id: 'anonymous',
            password,
            fullname: 'Anonymous',
          },
        ]),
      ),
  );
