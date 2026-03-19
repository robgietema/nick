/**
 * Purge events for caching
 * @module events/cache
 */

import { purgeXkey } from '../../helpers/cache/cache';

export const purge = {
  onAfterModified: async (context: any) => {
    purgeXkey(context.uuid);
  },

  onBeforeDelete: async (context: any) => {
    purgeXkey(context.uuid);
  },

  onAfterMove: async (context: any) => {
    purgeXkey(context.uuid);
  },

  onAfterDeleteUser: async (userid: string) => {
    purgeXkey(userid);
    purgeXkey('users');
  },

  onAfterUpdateUser: async (user: any) => {
    purgeXkey(user.id);
    purgeXkey('users');
  },

  onAfterAddUser: async (user: any) => {
    purgeXkey(user.id);
    purgeXkey('users');
  },

  onAfterDeleteGroup: async (groupid: string) => {
    purgeXkey(groupid);
    purgeXkey('groups');
  },

  onAfterUpdateGroup: async (group: any) => {
    purgeXkey(group.id);
    purgeXkey('groups');
  },

  onAfterAddGroup: async (group: any) => {
    purgeXkey(group.id);
    purgeXkey('groups');
  },
};
