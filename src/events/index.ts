/**
 * Point of contact for events.
 * @module events
 * @example import events from './events';
 */

import { isArray, mapKeys } from 'lodash';
import { Knex } from 'knex';
import { mapAsync } from '../helpers/utils/utils';

type EventHandler = (
  context: any,
  trx: Knex.Transaction,
  ...params: any[]
) => Promise<void>;

interface EventPlugin {
  [eventName: string]: EventHandler;
}

interface Events {
  register: (plugin: EventPlugin, position?: number | 'bottom') => void;
  trigger: (
    event: string,
    context: any,
    trx: Knex.Transaction,
    ...params: any[]
  ) => Promise<void>;
  events: {
    [eventName: string]: EventHandler[];
  };
}

const events: Events = {
  events: {},
  register: (plugin: EventPlugin, position: number | 'bottom' = 'bottom') => {
    mapKeys(plugin, (handler, event) => {
      if (!isArray(events.events[event])) {
        events.events[event] = [];
      }
      position === 'bottom'
        ? events.events[event].push(handler)
        : events.events[event].splice(position as number, 0, handler);
    });
  },

  trigger: async (
    event: string,
    context: any,
    trx: Knex.Transaction,
    ...params: any[]
  ): Promise<void> => {
    if (!events.events[event]) return;
    await mapAsync(
      events.events[event],
      async (handler) => await handler(context, trx, ...params),
    );
  },
};

export default events;
