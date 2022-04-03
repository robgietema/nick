/**
 * Controlpanels route.
 * @module routes/controlpanels/controlpanels
 */

export default [
  {
    op: 'get',
    view: '/@controlpanels',
    permission: 'View',
    handler: async (req, res) => res.send([]),
  },
];
