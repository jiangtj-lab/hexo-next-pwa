/* global hexo */

'use strict';

const { generator } = hexo.extend;
const { mergeWith } = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');
const { join } = require('path');
const injector = require('hexo-extend-injector2')(hexo);

/**
 * config
 */
const defaultConfig = yaml.load(fs.readFileSync(join(__dirname, 'default.yaml'), 'utf8'));
const config = mergeWith(defaultConfig.pwa, hexo.config.pwa, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
});

/**
 * inject js and manifest
 */
injector.register('head-end', `<link rel="manifest" href="${config.manifest.path}" />`);
injector.register('body-end', `
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('${config.serviceWorker.path}');
  });
}
</script>
`);

/**
 * generator manifest
 */
generator.register('pwa_manifest', () => {
  const manifest = config.manifest;
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
generator.register('pwa_service_worker', () => require('./lib/generate-sw-string')(config.serviceWorker));
