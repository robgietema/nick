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
   * @returns {Promise} A Promise that resolves when replace is done.
   */
  async replacePath(oldPath, newPath, options = {}) {
    const documents = await this.findAll({ path: ['~', `^${oldPath}`] });
    await Promise.all(
      documents.map(async (document) => {
        const redirect =
          oldPath === document.get('path')
            ? newPath
            : document
                .get('path')
                .replace(RegExp(`^${oldPath}(.*)$`), `${newPath}$1`);
        await RedirectRepository.create(
          {
            document: document.get('uuid'),
            path: document.get('path'),
            redirect,
          },
          { ...options, method: 'insert' },
        );
        await bookshelf.knex.raw(
          `update redirect set redirect = '${redirect}' where document = '${document.get(
            'uuid',
          )}'`,
        );
      }),
    );
    await bookshelf.knex.raw(
      `update document set path = regexp_replace(path, '^${oldPath}/(.*)$', '${newPath}/\\1', 'g') where path ~ '^${oldPath}/.*$'`,
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
   * Reorder
   * @method reorder
   * @param {String} uuid Uuid of the container to be fixed
   * @param {String} id Id of item to be moved
   * @param {Number} delta Offset of item to be moved
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise} A Promise that resolves when the ordering has been done.
   */
  async reorder(uuid, id, delta, options = {}) {
    const newDelta = delta < 0 ? delta * 10 - 5 : delta * 10 + 5;
    const items = await this.findAll(
      { parent: uuid },
      'position_in_parent',
      options,
    );
    return await Promise.all(
      items.map(
        async (item, index) =>
          await item.save(
            {
              position_in_parent:
                item.get('id') === id
                  ? item.get('position_in_parent') * 10 + newDelta
                  : item.get('position_in_parent') * 10,
            },
            { ...options, patch: true, require: false },
          ),
      ),
    );
  }

  /**
   * Fix order
   * @method fixOrder
   * @param {String} uuid Uuid of the container to be fixed
   * @param {Object} [options] Bookshelf options to pass on to destroy.
   * @returns {Promise} A Promise that resolves when the ordering has been done.
   */
  async fixOrder(uuid, options = {}) {
    const items = await this.findAll(
      { parent: uuid },
      'position_in_parent',
      options,
    );
    return await Promise.all(
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
