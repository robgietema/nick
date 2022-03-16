/**
 * Document Repository.
 * @module repositories/document/document
 */

import { Document } from '../../models';
import { BaseRepository } from '../../helpers';
import { RedirectRepository } from '../../repositories';
import bookshelf from '../../bookshelf';

/**
 * A Repository for Document.
 * @class DocumentRepository
 * @extends BaseRepository
 */
export class DocumentRepository extends BaseRepository {
  /**
   * Construct a DocumentRepository for Document.
   * @constructs DocumentRepository
   */
  constructor() {
    super(Document);
  }

  /**
   * Replace old path with new path
   * @method replacePath
   * @param {String} oldPath Old path.
   * @param {String} newPath New path.
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of Models.
   */
  replacePath(oldPath, newPath, options = {}) {
    return this.findAll({ path: ['~', `^${oldPath}`] })
      .then((documents) =>
        Promise.all(
          documents.map((document) => {
            const redirect =
              oldPath === document.get('path')
                ? newPath
                : document
                    .get('path')
                    .replace(RegExp(`^${oldPath}(.*)$`), `${newPath}$1`);
            return RedirectRepository.create(
              {
                document: document.get('uuid'),
                path: document.get('path'),
                redirect,
              },
              { ...options, method: 'insert' },
            ).then(() =>
              bookshelf.knex.raw(
                `update redirect set redirect = '${redirect}' where document = '${document.get(
                  'uuid',
                )}'`,
              ),
            );
          }),
        ),
      )
      .then(() =>
        bookshelf.knex.raw(
          `update document set path = regexp_replace(path, '^${oldPath}/(.*)$', '${newPath}/\\1', 'g') where path ~ '^${oldPath}/.*$'`,
        ),
      );
  }

  /**
   * Delete lock
   * @method deleteLock
   * @param {Object} document Document of lock to be deleted
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise<Object>} A Promise that resolves to the updated document.
   */
  deleteLock(document, options = {}) {
    return document.save(
      {
        lock: {
          locked: false,
          stealable: true,
        },
      },
      { ...options, patch: true },
    );
  }

  /**
   * Fix order
   * @method fixOrder
   * @param {String} uuid Uuid of the container to be fixed
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise} A Promise that resolves when the ordering has been done.
   */
  fixOrder(uuid, options = {}) {
    return this.findAll({ parent: uuid }, 'position_in_parent', options).then(
      (items) =>
        items.map(
          async (item, index) =>
            await item.save(
              { position_in_parent: index },
              { ...options, patch: true, require: false },
            ),
        ),
    );
  }
}

export default new DocumentRepository();
