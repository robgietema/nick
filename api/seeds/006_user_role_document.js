exports.seed = (knex) =>
  knex('user_role_document')
    .del()
    .then(() =>
      knex('user_role_document').insert([
        {
          user: '595efb73-cbdd-4bef-935a-a56f70a20854',
          role: 'Manager',
          document: '4ba6ac12-2a02-40be-a76f-9067ce98ed47',
        },
      ]),
    );
