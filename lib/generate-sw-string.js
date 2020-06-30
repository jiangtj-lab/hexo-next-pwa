'use strict';

const ejs = require('ejs');
const { resolve } = require('path');
const { upperFirst } = require('lodash');
const defineCache = new Map();
const define = (key, val) => {
  const defineSet = defineCache.get(key) || new Set();
  defineSet.add(val);
  defineCache.set(key, defineSet);
};

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
    define(`workbox.${plugin.name}`, pluginDefine);
    return `new ${pluginDefine}(${JSON.stringify(plugin.options)})`;
  });

  define('workbox.strategies', runtimeCachingEntry.handler);
  const handler = `new ${runtimeCachingEntry.handler}(${JSON.stringify(options, (key, value) => {
    if (key === 'plugins') {
      return '$plugins-point';
    }
    return value;
  })})`.replace('"$plugins-point"', `[${options.plugins.join(',')}]`);

  const method = runtimeCachingEntry.method || 'GET';

  define('workbox.routing', 'registerRoute');
  return `registerRoute(${capture}, ${handler}, '${method}');`;
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

  options.importDefine = Array.from(defineCache.entries())
    .map(([key, val]) => {
      return `const { ${Array.from(val.values()).join(', ')} } = ${key};`;
    })
    .join('\n');

  return {
    path: options.swDest,
    data: () => {
      return ejs.renderFile(resolve(__dirname, '../templates/sw-template.ejs'), options);
    }
  };
};
