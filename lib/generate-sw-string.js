'use strict';

const ejs = require('ejs');
const { resolve } = require('path');
const { upperFirst } = require('lodash');
const DefineCache = require('./define-cache');
const define = new DefineCache();

const handeRuntimeCaching = runtimeCachingEntry => {
  let capture = runtimeCachingEntry.urlPattern;
  if (typeof capture === 'string') {
    capture = `'${capture}'`;
  }

  const options = runtimeCachingEntry.options || {};

  options.plugins = options.plugins || [];
  ['backgroundSync', 'broadcastUpdate', 'cacheableResponse', 'expiration'].forEach(item => {
    if (options[item]) {
      const plugin = {};
      plugin.name = item;
      plugin.options = options[item];
      options.plugins.push(plugin);
      delete options[item];
    }
  });
  options.plugins = options.plugins.map(plugin => {
    const pluginDefine = `${upperFirst(plugin.name)}Plugin`;
    define.set(`workbox.${plugin.name}`, pluginDefine);
    return `new ${pluginDefine}(${JSON.stringify(plugin.options)})`;
  });

  define.set('workbox.strategies', runtimeCachingEntry.handler);
  const handler = `new ${runtimeCachingEntry.handler}(${JSON.stringify(options, (key, value) => {
    if (key === 'plugins') {
      return '$plugins-point';
    }
    return value;
  })})`.replace('"$plugins-point"', `[${options.plugins.join(',')}]`);

  const method = runtimeCachingEntry.method || 'GET';

  define.set('workbox.routing', 'registerRoute');
  return `registerRoute(${capture}, ${handler}, '${method}');`;
};

module.exports = serviceWorker => {
  const options = Object.assign({
    workboxCDN: serviceWorker.cdn,
    disableDevLogs: serviceWorker.disableDevLogs
  }, serviceWorker.options);

  if (options.runtimeCaching) {
    options.runtimeCaching = options.runtimeCaching.map(handeRuntimeCaching);
  }

  options.importDefine = define.toString();

  return {
    path: options.swDest,
    data: () => {
      return ejs.renderFile(resolve(__dirname, '../templates/sw-template.ejs'), options);
    }
  };
};
