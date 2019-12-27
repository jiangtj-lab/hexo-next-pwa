/* global hexo */

'use strict';

const { config } = hexo;
const { filter, generator } = hexo.extend;
const { generateSWString } = require('workbox-build');
const { mergeWith } = require('lodash');
const Util = require('next-util');
const yaml = require('js-yaml');
const utils = new Util(hexo, __dirname);

/**
 * config
 */
const defaultConfig = yaml.load(utils.getFileContent('default.yaml'));
config.pwa = mergeWith(defaultConfig.pwa, config.pwa, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
});

/**
 * inject js and manifest
 */
if (!config.pwa.disable_theme_inject) {
  filter.register('theme_inject', (injects) => {
    injects.head.raw('pwa-manifest', `<link rel="manifest" href="${config.pwa.manifest.path}" />`, {}, { cache: true, only: true });
    injects.bodyEnd.raw('pwa-register', `
    <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('${config.pwa.serviceWorker.path}');
      });
    }
    </script>
    `, {}, { cache: true, only: true });
  });
}
if (!config.pwa.disable_hexo_inject) {
  filter.register('inject_ready', (inject) => {
    inject.raw('head_end', `<link rel="manifest" href="${config.pwa.manifest.path}" />`)
    inject.raw('body_end', `
    <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('${config.pwa.serviceWorker.path}');
      });
    }
    </script>
    `)
  })
}

/**
 * generator manifest
 */
generator.register('pwa_manifest', () => {
  let manifest = config.pwa.manifest;
  return {
    path: manifest.path,
    data: JSON.stringify(
      Object.assign({
        name: config.title,
        start_url: config.url
      }, manifest.body)
    )
  };
});

/**
 * generator serviceWorker
 */
generator.register('pwa_service_worker', () => {
  let serviceWorker = config.pwa.serviceWorker;
  return generateSWString(serviceWorker.options)
    .then(result => {
      return {
        path: serviceWorker.path,
        data: () => {
          return result.swString;
        }
      };
    });
});
