import { transformSync } from '@babel/core';
import { readFileSync } from 'fs';
import { isArray, isObject, endsWith, mapKeys, mapValues, map } from 'lodash';

// const code = `export default ${readFileSync('./scripts/example.json')}`;
const code = readFileSync('./scripts/example.js');
// const code = readFileSync('./src/routes/login/login.js');
// const json = require('./example.json');

function parse(node) {
  if (isArray(node)) {
    return map(node, (child) => parse(child));
  } else if (isObject(node)) {
    return mapValues(
      mapKeys(node, (value, key) => key.replace(/:i18n$/, '')),
      (value) => parse(value),
    );
  } else {
    return node;
  }
}

const messages = {};

const output = transformSync(code, {
  plugins: [
    function myCustomPlugin() {
      return {
        visitor: {
          CallExpression(path) {
            const name =
              path.node.callee.type === 'Identifier'
                ? path.node.callee.name
                : path.node.callee.property.name;
            if (
              name === 'i18n' &&
              path.node.arguments[0].type === 'StringLiteral'
            ) {
              console.log(path.node.arguments[0]);
              const id = path.node.arguments[0].value;
              const defaultMessage =
                path.node.arguments.length > 1
                  ? path.node.arguments[1].value
                  : id;
              messages[id] = {
                id,
                defaultMessage,
                files: [
                  ...(id in messages ? messages[id].files : []),
                  { line: path.node.loc.start.line, file: 'kek.js' },
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
                  { line: path.node.loc.start.line, file: 'kek.js' },
                ],
              };
              // path.node.key.value = path.node.key.value.replace(':i18n', '');
            }
          },
        },
      };
    },
  ],
});

console.log(JSON.stringify(messages, null, '  '));
