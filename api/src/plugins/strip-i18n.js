const { endsWith } = require('lodash');

const plugin = function () {
  return {
    visitor: {
      ObjectProperty(path) {
        if (endsWith(path.node.key.value, ':i18n')) {
          path.node.key.value = path.node.key.value.replace(':i18n', '');
        }
      },
    },
  };
};

module.exports = plugin;
module.exports.default = plugin;
