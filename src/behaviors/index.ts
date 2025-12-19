/**
 * Point of contact for behaviors.
 * @module behaviors
 * @example import behaviors from './behaviors';
 */

import { id_from_title } from './id_from_title/id_from_title';

import config from '../helpers/config/config';

const behaviors = {
  id_from_title,
  ...('behaviors' in config.settings ? config.settings.behaviors : {}),
};

export default behaviors;
