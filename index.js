/* global hexo */

'use strict';

const { config } = hexo;
const { generator } = hexo.extend;
const { generateSWString } = require('workbox-build');
const { mergeWith } = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');
const { join } = require('path');
const injector = require('hexo-extend-injector2')(hexo);

/**
 * config
 */
const defaultConfig = yaml.load(fs.readFileSync(join(__dirname, 'default.yaml'), 'utf8'));
config.pwa = mergeWith(defaultConfig.pwa, config.pwa, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
});

/**
 * inject js and manifest
 */
injector.register('head-end', `<link rel="manifest" href="${config.pwa.manifest.path}" />`);
injector.register('body-end', `
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('${config.pwa.serviceWorker.path}');
  });
}
</script>
`);

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
