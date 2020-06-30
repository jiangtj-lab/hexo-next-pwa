'use strict';

/**
 * 生成原生workbox-build内容，作为内建的generate-sw-string的参考对象
 */

require('chai').should();
const { load } = require('js-yaml');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { generateSW } = require('workbox-build');

describe('main', () => {
  const config = load(readFileSync(resolve(__dirname, '../default.yaml'), 'utf8')).pwa;

  const options = Object.assign(config.serviceWorker.options, {
    mode: 'dev',
    sourcemap: false,
    swDest: 'test/temp/sw-build.js'
  });

  generateSW(options)
    .then(obj => console.log(obj));
});
