/* eslint no-console: 0 */
/**
 * Convert script.
 * @module scripts/convert
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { sync as glob } from 'glob';
import { endsWith, keys, map } from 'lodash';

/**
 * Read file
 * @param {string} path Path of the file.
 * @returns {Object} JSON data
 */
const readfile = (path) => {
  return JSON.parse(readFileSync(path, 'utf8'));
};

/**
 * Convert users
 * @param {Array} users Users to import.
 * @param {string} path Path of the output folder.
 */
const convertUsers = (users, path) => {
  console.log('Converting users...');

  console.log('done!');
};

/**
 * Convert redirects
 * @param {Array} redirects Redirects to import.
 * @param {string} path Path of the output folder.
 */
const convertRedirects = (redirects, path) => {
  console.log('Converting redirects...');
  const output = [];

  // Loop through redirects
  map(keys(redirects), (key) => {
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
const convertGroups = (groups, path) => {
  console.log('Converting groups...');

  console.log('done!');
};

/**
 * Convert documents
 * @param {string} input Input folder to import.
 * @param {string} path Path of the output folder.
 */
const convertDocuments = (input, path) => {
  console.log('Converting documents...');

  // Create folder
  mkdirSync(`${path}/documents`);

  map(glob(`${input}/content/**/*.json`), (filename) => {
    if (endsWith(filename, '__metadata__.json')) {
      return;
    }
    let document = JSON.parse(readFileSync(filename, 'utf8'));
    document.uuid = document.UID;
    delete document.UID;

    // Write files
    writeFileSync(
      `${path}/documents/${document['@id'].replaceAll('.', '-').replaceAll('/', '.').substring(1)}.json`,
      JSON.stringify(document),
    );
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
    console.log('Usage: yarn convert <inputfolder> <outputfolder>');
    return;
  }

  // Get folders
  const inputfolder = process.argv[2];
  const outputfolder = process.argv[3];

  // Create output folder
  if (existsSync(outputfolder)) {
    rmSync(outputfolder, { recursive: true });
  }
  mkdirSync(outputfolder, { recursive: true });

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
