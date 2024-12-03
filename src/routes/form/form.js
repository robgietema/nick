/**
 * Form routes.
 * @module routes/form/form
 */

export default [
  {
    op: 'post',
    view: '/@schemaform-data',
    permission: 'View',
    handler: async (req, trx) => {
      return {
        json: {},
      };
    },
  },
];
