import { compact, uniq } from 'lodash';
import { RequestException, getPath, getUserId, hasPermission } from '../';
import { Document, Redirect, Role, Type, User } from '../../models';

/**
 * Resolve and call handler
 * @method handleFiles
 * @param {Request} req Request object
 * @param {Knex.Transaction} trx Transaction object.
 * @param {Object} route Route object.
 * @param {Function} callback Callback function.
 * @returns {any} Response
 */
export async function callHandler(req, trx, route, callback) {
  // Get user
  req.user = await User.fetchById(
    getUserId(req),
    {
      related: '[_roles, _groups._roles]',
    },
    trx,
  );

  // Traverse to document
  const root = await Document.fetchOne({ parent: null }, {}, trx);
  const result = await root.traverse(
    compact(getPath(req).split('/')), // Slugs
    req.user,
    await req.user.fetchUserGroupRolesByDocument(root.uuid), // Root roles
    root,
    trx,
  );

  // If result not found
  if (!result) {
    // Find redirect
    const redirect = await Redirect.fetchByPath(getPath(req), trx);

    // If no redirect found
    if (!redirect) {
      throw new RequestException(404, {
        error: req.i18n(`Not found: ${getPath(req)}`),
      });
    }

    // Send redirect
    throw new RequestException(301, `${redirect._document.path}${route.view}`);
  }

  // Get results
  const { document, localRoles } = result;
  const mergedRoles = uniq([...localRoles, ...req.user.getRoles()]);
  const permissions = await Role.fetchPermissions(mergedRoles, trx);

  // Find type
  const type = await Type.fetchById(document.type, {}, trx);

  // Check if type found
  if (!type) {
    throw new RequestException(500, {
      message: req.i18n('Type of the current document is not found.'),
    });
  }

  // Get workflow
  await type.fetchRelated('_workflow', trx);

  // Apply behaviors
  await document.applyBehaviors(trx);

  // Call handler
  req.document = document;
  req.navroot = result.navroot;
  req.type = type;
  req.permissions = uniq([
    ...permissions,
    ...type._workflow.getPermissions(document.workflow_state, mergedRoles),
  ]);

  // Check permission
  if (!hasPermission(req.permissions, route.permission)) {
    throw new RequestException(401, {
      message: req.i18n('You are not authorization to access this resource.'),
    });
  }

  // Call view
  return route.handler(req, trx, callback);
}
