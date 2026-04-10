/**
 * Content Rules events
 * @module events/content_rules
 */

import { Knex } from 'knex';

const hander = async (
  event: string,
  context: any,
  trx: Knex.Transaction,
  ...params: any[]
) => {
  // Handle content rules
};

export const content_rules = {
  onAfterAdd: async (context: any, trx: Knex.Transaction, ...params: any[]) =>
    hander('onAfterAdd', context, trx, ...params),
  onAfterDelete: async (
    context: any,
    trx: Knex.Transaction,
    ...params: any[]
  ) => hander('onAfterDelete', context, trx, ...params),
  onAfterModified: async (
    context: any,
    trx: Knex.Transaction,
    ...params: any[]
  ) => hander('onAfterModified', context, trx, ...params),
  onAfterCopy: async (context: any, trx: Knex.Transaction, ...params: any[]) =>
    hander('onAfterCopy', context, trx, ...params),
  onAfterChangeWorkflow: async (
    context: any,
    trx: Knex.Transaction,
    ...params: any[]
  ) => hander('onAfterChangeWorkflow', context, trx, ...params),

  onAfterLogin: async (user: any, trx: Knex.Transaction, ...params: any[]) =>
    hander('onAfterLogin', user, trx, ...params),
  onAfterLogout: async (user: any, trx: Knex.Transaction, ...params: any[]) =>
    hander('onAfterLogout', user, trx, ...params),
  onAfterCreateUser: async (
    user: any,
    trx: Knex.Transaction,
    ...params: any[]
  ) => hander('onAfterCreateUser', user, trx, ...params),
  onAfterDeleteUser: async (
    userid: string,
    trx: Knex.Transaction,
    ...params: any[]
  ) => hander('onAfterDeleteUser', { id: userid }, trx, ...params),
};
