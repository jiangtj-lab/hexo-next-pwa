/* global hexo */

'use strict';

const { generator } = hexo.extend;
const injector = require('hexo-extend-injector2')(hexo);
const config = require('./lib/get-default-config')(hexo);
const validate = require('./lib/validate-sw-options');

const { manifest, serviceWorker } = config;
serviceWorker.options = validate(serviceWorker.options);

/**
 * generator manifest
 */
injector.register('head-end', `<link rel="manifest" href="${manifest.path}" />`);
generator.register('pwa_manifest', () => {
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
    navigator.serviceWorker.register('${serviceWorker.options.swDest}');
  });
}
</script>
`);

generator.register('pwa_service_worker', locals => {
  return require('./lib/generate-sw-string')(locals, serviceWorker)
    .then(({files}) => {
      return files.map(file => ({
        path: file.name,
        data: file.contents
      }));
    });
});
