const { isObject } = require('../utils');

const pluginRules = {
  rules: {
    default: '*',
    format: function (e) {
      // transform to function
      if (typeof e === 'string') {
        return e === '*' ? () => true : ext => ext === e;
      }
      if (Array.isArray(e)) {
        return ext => e.indexOf(ext) !== -1;
      }
      if (typeof e !== 'function') {
        throw new Error('plugin rules format error');
      }

      return e;
    }
  },
  main: {
    format: function (e) {
      if (typeof e !== 'function') {
        throw new Error('plugin main function format error');
      }

      return e;
    }
  }
};

const configRules = {
  plugins: {
    default: [],
    format: function (e) {
      if (!Array.isArray(e)) {
        throw new Error('config plugins must be a array');
      }

      for(const plugin of e) {
        if (!isObject(plugin)) throw new Error('plugin must be a object');
        checkFormat(plugin, pluginRules);
      }

      return e;
    }
  }
};

const checkFormat = function (obj, rules) {
  for (const key of Object.keys(rules)) {
    const value = rules[key];
    const objValue = obj[key];
    // check format
    obj[key] = value.format(typeof objValue === 'undefined' ? value.default : objValue);
  }
};

const checkConfigFormat = function (config) {
  if (!isObject(config)) throw new Error('config must be a object');

  checkFormat(config, configRules);
};

module.exports = checkConfigFormat;
