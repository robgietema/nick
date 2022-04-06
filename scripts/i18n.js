/* eslint no-console: 0 */
/**
 * i18n script.
 * @module scripts/i18n
 */

import { find, keys, map, zipObject } from 'lodash';
import { sync as glob } from 'glob';
import Pofile from 'pofile';
import { transformSync } from '@babel/core';
import { readFileSync, writeFileSync } from 'fs';
import { endsWith } from 'lodash';

/**
 * Convert messages to pot format
 * @function messagesToPot
 * @param {Object} messages Messages
 * @return {string} Formatted pot string
 */
function messagesToPot(messages) {
  return map(keys(messages).sort(), (key) =>
    [
      ...map(messages[key].files, (file) => `#: ${file.file}:${file.line}`),
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
    let { items } = Pofile.parse(readFileSync(filename, 'utf8'));
    const lang = filename.match(/locales\/(.*)\/LC_MESSAGES\//)[1];

    // Write the corresponding language JSON, cover the special EN use case for including
    // defaults if not present
    writeFileSync(
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
  const pot = Pofile.parse(readFileSync('locales/nick.pot', 'utf8'));

  map(glob('locales/**/*.po'), (filename) => {
    const po = Pofile.parse(readFileSync(filename, 'utf8'));

    writeFileSync(
      filename,
      `${formatHeader(po.comments, po.headers)}
${map(pot.items, (item) => {
  const poItem = find(po.items, { msgid: item.msgid });
  return [
    `${map(item.references, (ref) => `#: ${ref}`).join('\n')}`,
    ...map(item.comments, (comment) => `# ${comment}`),
    `msgid "${item.msgid}"`,
    `msgstr "${poItem ? poItem.msgstr : ''}"`,
  ].join('\n');
}).join('\n\n')}\n`,
    );
  });
}

function extractMessages() {
  const messages = {};

  const plugin = (file) => ({
    visitor: {
      CallExpression(path) {
        const callee = path.node.callee;
        let name = callee.type === 'Identifier' ? callee.name : '';
        name = callee.type === 'MemberExpression' ? callee.property.name : name;

        if (
          name === 'i18n' &&
          path.node.arguments[0].type === 'StringLiteral'
        ) {
          const id = path.node.arguments[0].value;
          const defaultMessage =
            path.node.arguments.length > 1 ? path.node.arguments[1].value : id;
          messages[id] = {
            id,
            defaultMessage,
            files: [
              ...(id in messages ? messages[id].files : []),
              { line: path.node.loc.start.line, file },
            ],
          };
        }
      },
      ObjectProperty(path) {
        if (endsWith(path.node.key.value, ':i18n')) {
          const id = path.node.value.value;
          messages[id] = {
            id,
            defaultMessage: id,
            files: [
              ...(id in messages ? messages[id].files : []),
              { line: path.node.loc.start.line, file },
            ],
          };
          // path.node.key.value = path.node.key.value.replace(':i18n', '');
        }
      },
    },
  });

  // Read js files
  map(glob('src/**/*.js'), (file) => {
    transformSync(readFileSync(file), {
      plugins: [plugin(file)],
    });
  });

  // Read json files
  map(glob('src/**/*.json'), (file) => {
    transformSync(`export default ${readFileSync(file)}`, {
      plugins: [plugin(file)],
    });
  });

  return messages;
}

/**
 * Main function
 * @function main
 * @return {undefined}
 */
async function main() {
  console.log('Extracting messages from source files...');

  const messages = extractMessages();

  console.log('Synchronizing messages to pot file...');

  const newPot = `${potHeader()}${messagesToPot(messages)}\n`.replace(
    /"POT-Creation-Date:(.*)\\n"/,
    '',
  );
  const oldPot = readFileSync('locales/nick.pot', 'utf8').replace(
    /"POT-Creation-Date:(.*)\\n"/,
    '',
  );

  // We only write the pot file if it's really different
  if (newPot !== oldPot) {
    writeFileSync(
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
