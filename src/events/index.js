/**
 * Point of contact for events.
 * @module events
 * @example import events from './events';
 */

import { isArray, mapKeys } from 'lodash';

import { mapAsync } from '../helpers/utils/utils';

const events = {
  register: (plugin, position = 'bottom') => {
    mapKeys(plugin, (handler, event) => {
      if (!isArray(events[event])) {
        events[event] = [];
      }
      position === 'bottom'
        ? events[event].push(handler)
        : events[event].splice(position, 0, handler);
    });
  },

  trigger: async (event, context, trx, ...params) => {
    if (!events[event]) return;
    await mapAsync(
      events[event],
      async (handler) => await handler(context, trx, ...params),
    );
  },
};

export default events;
