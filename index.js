/* global hexo */

'use strict';

const { generator } = hexo.extend;
const { mergeWith } = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');
const { join } = require('path');
const injector = require('hexo-extend-injector2')(hexo);

const unsafe = require('js-yaml-js-types').all;
const schema = yaml.DEFAULT_SCHEMA.extend(unsafe);


/**
 * config
 */
const defaultConfig = yaml.load(fs.readFileSync(join(__dirname, 'default.yaml'), 'utf8'), {schema});
const config = mergeWith(defaultConfig.pwa, hexo.config.pwa, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return srcValue;
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
