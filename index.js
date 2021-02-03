/* global hexo */

'use strict';

const { generator } = hexo.extend;
const { mergeWith } = require('lodash');
const yaml = require('js-yaml');
const { readFileSync } = require('fs');
const { join } = require('path');
const injector = require('hexo-extend-injector2')(hexo);
const schema = require('./lib/get-yaml-schema')(hexo);

/**
 * config
 */
const defaultConfig = yaml.load(readFileSync(join(__dirname, 'default.yaml'), 'utf8'), { schema });
const config = mergeWith(defaultConfig.pwa, hexo.config.pwa, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
});
config.serviceWorker.options.runtimeCaching.forEach(element => {
  if (element.urlPattern.startsWith('regexp:')) {
    element.urlPattern = new RegExp(element.urlPattern.substring(7));
  }
});


const generateSWSchema = require('workbox-build/src/options/schema/generate-sw');
const validate = require('workbox-build/src/lib/validate-options');
config.serviceWorker.options.globDirectory = 'ignore';
const options = validate(config.serviceWorker.options, generateSWSchema);

/**
 * generator manifest
 */
injector.register('head-end', `<link rel="manifest" href="${config.manifest.path}" />`);
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
injector.register('body-end', `
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('${options.swDest}');
  });
}
</script>
`);

generator.register('pwa_service_worker', locals => {
  return require('./lib/generate-sw-string')(locals, options)
    .then(({files}) => {
      return files.map(file => ({
        path: file.name,
        data: file.contents
      }));
    });
});
