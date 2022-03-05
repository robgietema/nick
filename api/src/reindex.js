/**
 * Reindex script.
 * @module reindex
 */

import { flush, connect, index } from './catalog';
import { DocumentRepository } from './repositories';

connect().then(() =>
  flush().then(() =>
    DocumentRepository.findAll().then((documents) =>
      index(documents).then(() => {
        console.log(`Reindexed ${documents.length} documents.`);
        process.exit();
      }),
    ),
  ),
);
