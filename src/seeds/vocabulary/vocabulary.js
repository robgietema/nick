import { dropRight } from 'es-toolkit/array';
import { promises as fs } from 'fs';

import { dirExists } from '../../helpers/fs/fs';
import { mapAsync } from '../../helpers/utils/utils';
import { stripI18n } from '../../helpers/i18n/i18n';

import { Vocabulary } from '../../models/vocabulary/vocabulary';

export const seedVocabulary = async (trx, profilePath) => {
  if (dirExists(`${profilePath}/vocabularies`)) {
    // Get vocabulary profiles
    const vocabularies = (await fs.readdir(`${profilePath}/vocabularies`))
      .map((file) => dropRight(file.split('.'), 1).join('.'))
      .sort();

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
