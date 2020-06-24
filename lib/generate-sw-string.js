'use strict';

const ejs = require('ejs');
const { resolve } = require('path');
const { values } = require('lodash');

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
    return `new workbox.${plugin.name}.${plugin.name}Plugin(${JSON.stringify(plugin.options)})`;
  });
  const handler = `new workbox.strategies.${runtimeCachingEntry.handler}(${JSON.stringify(options, (key, value) => {
    if (key === 'plugins') {
      return {aaa: 'plugins'};
    }
    return value;
  })})`;
  const method = runtimeCachingEntry.method || 'GET';
  return `workbox.routing.registerRoute(${capture}, ${handler}, '${method}')`;
};

module.exports = serviceWorker => {
  console.log(serviceWorker);
  const options = Object.assign({
    workbox_cdn: serviceWorker.workbox_cdn,
    disableDevLogs: false
  }, serviceWorker.options);

  if (options.runtimeCaching) {
    options.runtimeCaching = options.runtimeCaching.map(handeRuntimeCaching);
  }

  return {
    path: serviceWorker.path,
    data: () => {
      return ejs.renderFile(resolve(__dirname, '../templates/sw-template.ejs'), options);
    }
  };
};
