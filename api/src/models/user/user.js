/**
 * User Model.
 * @module models/user/user
 */

import { BaseModel } from '../../helpers';

export default BaseModel.extend({ tableName: 'user', idAttribute: 'uuid' });
