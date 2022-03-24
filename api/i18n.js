/* eslint no-console: 0 */
/**
 * i18n script.
 * @module scripts/i18n
 */

import { extract } from '@formatjs/cli';
import { find, keys, map, zipObject } from 'lodash';
import { sync as glob } from 'glob';
import fs from 'fs';
import Pofile from 'pofile';

/**
 * Convert messages to pot format
 * @function messagesToPot
 * @param {Object} messages Messages
 * @return {string} Formatted pot string
 */
function messagesToPot(messages) {
  return map(keys(messages).sort(), (key) =>
    [
      `#: ${messages[key].file}:${messages[key].line}`,
      `# defaultMessage: ${messages[key].defaultMessage}`,
      `msgid "${key}"`,
      'msgstr ""',
    ].join('\n'),
  ).join('\n\n');
}

/**
 * Pot header
 * @function potHeader
 * @return {string} Formatted pot header
 */
function potHeader() {
  return `msgid ""
msgstr ""
"Project-Id-Version: Nick\\n"
"POT-Creation-Date: ${new Date().toISOString()}\\n"
"Last-Translator: Rob Gietema\\n"
"Language-Team: Nick\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=utf-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=1; plural=0;\\n"
"Language-Code: en\\n"
"Language-Name: English\\n"
"Preferred-Encodings: utf-8\\n"
"Domain: nick\\n"

`;
}

/**
 * Convert po files into json
 * @function poToJson
 * @return {undefined}
 */
function poToJson() {
  map(glob('locales/**/*.po'), (filename) => {
    let { items } = Pofile.parse(fs.readFileSync(filename, 'utf8'));
    const lang = filename.match(/locales\/(.*)\/LC_MESSAGES\//)[1];

    // Write the corresponding language JSON, cover the special EN use case for including
    // defaults if not present
    fs.writeFileSync(
      `locales/${lang}.json`,
      JSON.stringify(
        zipObject(
          map(items, (item) => item.msgid),
          map(items, (item) =>
            lang === 'en'
              ? item.msgstr[0] ||
                (item.comments[0]
                  ? item.comments[0].replace('defaultMessage: ', '')
                  : '')
              : item.msgstr[0],
          ),
        ),
      ),
    );
  });
}

/**
 * Format header
 * @function formatHeader
 * @param {Array} comments Array of comments
 * @param {Object} headers Object of header items
 * @return {string} Formatted header
 */
function formatHeader(comments, headers) {
  return [
    ...map(comments, (comment) => `# ${comment}`),
    'msgid ""',
    'msgstr ""',
    ...map(keys(headers), (key) => `"${key}: ${headers[key]}\\n"`),
    '',
  ].join('\n');
}

/**
 * Sync po by the pot file
 * @function syncPoByPot
 * @return {undefined}
 */
function syncPoByPot() {
  const pot = Pofile.parse(fs.readFileSync('locales/nick.pot', 'utf8'));

  map(glob('locales/**/*.po'), (filename) => {
    const po = Pofile.parse(fs.readFileSync(filename, 'utf8'));

    fs.writeFileSync(
      filename,
      `${formatHeader(po.comments, po.headers)}
${map(pot.items, (item) => {
  const poItem = find(po.items, { msgid: item.msgid });
  return [
    `${map(item.references, (ref) => `#: ${ref}`).join('\n')}`,
    `# ${item.comments[0]}`,
    `msgid "${item.msgid}"`,
    `msgstr "${poItem ? poItem.msgstr : ''}"`,
  ].join('\n');
}).join('\n\n')}\n`,
    );
  });
}

async function main() {
  console.log('Extracting messages from source files...');
  const messages = JSON.parse(
    await extract(glob('src/**/*.js'), {
      extractSourceLocation: true,
    }),
  );

  console.log('Synchronizing messages to pot file...');

  const newPot = `${potHeader()}${messagesToPot(messages)}\n`.replace(
    /"POT-Creation-Date:(.*)\\n"/,
    '',
  );
  const oldPot = fs
    .readFileSync('locales/nick.pot', 'utf8')
    .replace(/"POT-Creation-Date:(.*)\\n"/, '');

  // We only write the pot file if it's really different
  if (newPot !== oldPot) {
    fs.writeFileSync(
      'locales/nick.pot',
      `${potHeader()}${messagesToPot(messages)}\n`,
    );
  }

  console.log('Synchronizing messages to po files...');

  syncPoByPot();

  console.log('Write messages to json files...');

  poToJson();

  console.log('done!');
}

main();
