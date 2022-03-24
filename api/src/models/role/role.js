/**
 * Role Model.
 * @module models/role/role
 */

import { BaseModel } from '../../helpers';

export const Role = BaseModel.extend({ tableName: 'role', idAttribute: 'id' });
