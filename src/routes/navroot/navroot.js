/**
 * Navigation root route.
 * @module routes/navroot/navroot
 */

export const handler = async (req, trx) => {
  await req.navroot.fetchRelated('[_children(order)._type, _type]', trx);
  await req.navroot.fetchRelationLists(trx);

  return {
    json: await req.navroot.toJSON(req),
  };
};

export default [
  {
    op: 'get',
    view: '/@navroot',
    permission: 'View',
    client: 'getNavroot',
    handler,
  },
];
