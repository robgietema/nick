/* eslint no-console: 0 */
/**
 * Convert script.
 * @module scripts/convert
 */

import {
  existsSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { sync as glob } from 'glob';
import { last } from 'es-toolkit/array';
import { v4 as uuid } from 'uuid';

/**
 * Read file
 * @param {string} path Path of the file.
 * @returns {Object} JSON data
 */
const readfile = (path: string) => {
  return JSON.parse(readFileSync(path, 'utf8'));
};

/**
 * Convert users
 * @param {Array} users Users to import.
 * @param {string} path Path of the output folder.
 */
const convertUsers = (users: any[], path: string) => {
  console.log('Converting users...');

  console.log('done!');
};

/**
 * Convert redirects
 * @param {Array} redirects Redirects to import.
 * @param {string} path Path of the output folder.
 */
const convertRedirects = (redirects: any, path: string) => {
  console.log('Converting redirects...');
  const output = [] as any[];

  // Loop through redirects
  Object.keys(redirects).map((key) => {
    const document = readfile(
      `${path}/documents/${redirects[key].replace('/Plone/', '').replaceAll('.', '-').replaceAll('/', '.')}.json`,
    );
    if (document) {
      output.push({
        document: document.uuid,
        path: key.replace('/Plone', ''),
      });
    }
  });

  // Write files
  writeFileSync(`${path}/redirects.json`, JSON.stringify(output));

  console.log('done!');
};

/**
 * Convert groups
 * @param {Array} groups Groups to import.
 * @param {string} path Path of the output folder.
 */
const convertGroups = (groups: any[], path: string) => {
  console.log('Converting groups...');

  console.log('done!');
};

/**
 * Convert documents
 * @param {string} input Input folder to import.
 * @param {string} path Path of the output folder.
 */
const convertDocuments = (input: string, path: string) => {
  console.log('Converting documents...');

  // Remove folder if exists
  if (existsSync(`${path}/documents`)) {
    rmSync(`${path}/documents`, { recursive: true });
  }

  // Create folder
  mkdirSync(`${path}/documents`);
  mkdirSync(`${path}/documents/images`);

  let relations = [];
  if (existsSync(`${input}/relations.json`)) {
    relations = readfile(`${input}/relations.json`);
  }
  const references = {} as any;
  relations.map((relation: any) => {
    if (typeof references[relation.from_uuid] !== 'object') {
      references[relation.from_uuid] = [];
    }
    if (relation.from_attribute !== 'isReferencing') {
      references[relation.from_uuid].push({
        attr: relation.from_attribute,
        to: relation.to_uuid,
      });
    }
  });

  glob(`${input}/content/**/*.json`).map((filename) => {
    if (filename.endsWith('__metadata__.json')) {
      return;
    }
    const document = JSON.parse(readFileSync(filename, 'utf8'));

    // Set correct uuid field
    document.uuid = document.UID;
    delete document.UID;

    // Convert types
    if (document['@type'] === 'Plone Site') {
      document['@type'] = 'Site';
      document.uuid = uuid();
    }
    if (document['@type'] === 'LRF') {
      document['@type'] = 'Languageroot';
    }
    if (document['@type'] === 'Document') {
      document['@type'] = 'Page';
    }
    if (document['@type'] === 'LIF') {
      document['@type'] = 'Folder';
    }
    document.type = document['@type'];
    delete document['@type'];

    // Remove fields
    delete document.version;

    // Fix language
    if (document.language === '##DEFAULT##') {
      document.language = 'en';
    }

    // Fix images
    if (document.type === 'Image') {
      const file = (
        last(document.image.blob_path.split('/')) as string
      ).replace(' ', '_');
      mkdirSync(`${path}/documents/images/${document.uuid}`);
      copyFileSync(
        `${input}/content/${document.image.blob_path}`,
        `${path}/documents/images/${document.uuid}/${file}`,
      );
      document.image = `/images/${document.uuid}/${file}`;
    }

    // Add references
    if (references[document.uuid]) {
      references[document.uuid].map((reference: any) => {
        const targetfile = `${input}/content/${reference.to}/data.json`;
        if (existsSync(targetfile)) {
          const target = JSON.parse(
            readFileSync(`${input}/content/${reference.to}/data.json`, 'utf8'),
          );
          document[reference.attr] = [
            {
              '@id': target['@id'].replace('.', '-'),
              UID: target.UID,
              title: target.title,
            },
          ];
        }
      });
    }

    // Convert to string
    let json = JSON.stringify(document);

    // Resolve targets
    json = json.replaceAll(/\"[^"]*resolveuid\/([^"]*)\"/g, (result, uuid) => {
      const targetfile = `${input}/content/${uuid}/data.json`;
      if (existsSync(targetfile)) {
        const target = JSON.parse(
          readFileSync(`${input}/content/${uuid}/data.json`, 'utf8'),
        );
        return `"${target['@id'].replace('.', '-')}"`;
      } else {
        console.log(`Not found: ${targetfile}`);
      }
      return `"${uuid}"`;
    });

    // Convert index operations
    json = json.replaceAll('plone.app.querystring.operation.', '');

    const output =
      document['@id'] === '/Plone'
        ? `${path}/documents/_root.json`
        : `${path}/documents/${document['@id'].replaceAll('.', '-').replaceAll('/', '.').substring(1)}.json`;

    // Write files
    writeFileSync(output, json);
  });

  console.log('done!');
};

/**
 * Main function
 * @function main
 * @return {undefined}
 */
async function main() {
  // Check arguments
  if (process.argv.length !== 4) {
    console.log('Usage: pnpm convert <inputfolder> <outputfolder>');
    return;
  }

  // Get folders
  const inputfolder = process.argv[2];
  const outputfolder = process.argv[3];

  // Create output folder
  if (!existsSync(outputfolder)) {
    mkdirSync(outputfolder, { recursive: true });
  }

  // Convert principals
  if (existsSync(`${inputfolder}/principals.json`)) {
    const principals = readfile(`${inputfolder}/principals.json`);

    // Convert users
    convertUsers(principals.members, outputfolder);

    // Convert groups
    convertGroups(principals.groups, outputfolder);
  }

  // Convert documents
  convertDocuments(inputfolder, outputfolder);

  // Convert redirects
  if (existsSync(`${inputfolder}/redirects.json`)) {
    const redirects = readfile(`${inputfolder}/redirects.json`);

    // Convert redirects
    convertRedirects(redirects, outputfolder);
  }
}

main();
