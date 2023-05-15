/**
 * Point of contact for behaviors.
 * @module behaviors
 * @example import behaviors from './behaviors';
 */

import { id_from_title } from './id_from_title/id_from_title';

const { config } = require(`${process.cwd()}/config`);

const behaviors = {
  id_from_title,
  ...('behaviors' in config ? config.behaviors : {}),
};

export default behaviors;
