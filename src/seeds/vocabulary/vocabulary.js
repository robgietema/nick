import { dropRight, map } from 'lodash';
import { promises as fs } from 'fs';

import { dirExists, mapAsync, stripI18n } from '../../helpers';
import { Vocabulary } from '../../models';

export const seedVocabulary = async (trx, profilePath) => {
  if (dirExists(`${profilePath}/vocabularies`)) {
    // Get vocabulary profiles
    const vocabularies = map(
      await fs.readdir(`${profilePath}/vocabularies`),
      (file) => dropRight(file.split('.')).join('.'),
    ).sort();

    // Import vocabularies
    await mapAsync(vocabularies, async (vocabulary) => {
      const data = stripI18n(
        require(`${profilePath}/vocabularies/${vocabulary}`),
      );
      await Vocabulary.create(data, {}, trx);
    });
    console.log('Vocabularies imported');
  }
};
