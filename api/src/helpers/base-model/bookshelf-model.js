/**
 * Bookshelf BaseModel.
 * @module helpers/base-model/base-model
 */

import bookshelf from '../../bookshelf';

const instanceProps = {};
const classProps = {};

export const BookshelfModel = bookshelf.Model.extend(instanceProps, classProps);
