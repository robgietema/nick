/**
 * Point of contact for behaviors.
 * @module behaviors
 * @example import { Document } from './models';
 */

import { assign, pick, values } from 'lodash';

import { id_from_title } from './id_from_title/id_from_title';

const { config } = require(`${process.cwd()}/config`);

const behaviors = {
  id_from_title,
  ...('behaviors' in config ? config.behaviors : {}),
};

/**
 * Apply behaviors to document.
 * @method applyBehaviors
 * @param {Object} document Document model.
 * @param {Array} newBehaviors Array of behaviors to be applied.
 * @returns {Object} Document with behaviors applied.
 */
export function applyBehaviors(document, newBehaviors) {
  return assign(document, ...values(pick(behaviors, newBehaviors)));
}
