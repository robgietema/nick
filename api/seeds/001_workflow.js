exports.seed = (knex) =>
  knex('workflow')
    .del()
    .then(() =>
      knex('workflow').insert([
        {
          id: 'simple_publication_workflow',
          title: 'Simple Publication Workflow',
          description:
            'Simple workflow that is useful for basic web sites. Things start out as private, and can either be submitted for review, or published directly. The creator of a content item can edit the item even after it is published.',
          json: {
            initial_state: 'private',
            states: {
              private: {
                title: 'Private',
                description: 'Can only be seen and edited by the owner.',
                transitions: ['publish', 'submit'],
                permissions: {
                  Contributer: ['View'],
                  Editor: ['View', 'Modify'],
                  Owner: ['View', 'Modify'],
                  Reader: ['View'],
                  Administrator: ['View', 'Modify'],
                },
              },
              pending: {
                title: 'Pending review',
                description:
                  'Waiting to be reviewed, not editable by the owner.',
                transitions: ['publish', 'reject', 'retract'],
                permissions: {
                  Contributer: ['View'],
                  Editor: ['View'],
                  Owner: ['View'],
                  Reader: ['View'],
                  Reviewer: ['View', 'Modify'],
                  Administrator: ['View', 'Modify'],
                },
              },
              published: {
                title: 'Published',
                description: 'Visible to everyone, editable by the owner.',
                transitions: ['reject', 'retract'],
                permissions: {
                  Anonymous: ['View'],
                  Authenticated: ['View'],
                  Editor: ['Modify'],
                  Owner: ['Modify'],
                  Administrator: ['Modify'],
                },
              },
            },
            transitions: {
              publish: {
                title: 'Publish',
                new_state: 'published',
                permission: 'Review',
              },
              reject: {
                title: 'Send back',
                new_state: 'private',
                permission: 'Review',
              },
              retract: {
                title: 'Retract',
                new_state: 'private',
                permission: 'Submit',
              },
              submit: {
                title: 'Submit for publication',
                new_state: 'pending',
                permission: 'Submit',
              },
            },
          },
        },
      ]),
    );