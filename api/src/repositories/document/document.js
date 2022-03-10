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
   * @returns {Promise<Collection>} A Promise that resolves to a Collection of Models.
   */
  replacePath(oldPath, newPath) {
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
              { method: 'insert' },
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
}

export default new DocumentRepository();
