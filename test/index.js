'use strict';

require('chai').should();
const Hexo = require('hexo');
// eslint-disable-next-line no-unused-vars
const hexo = new Hexo(__dirname, { silent: true });
const { load } = require('js-yaml');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

describe('main', () => {
  const config = load(readFileSync(resolve(__dirname, '../default.yaml'), 'utf8')).pwa;
  const template = require('../lib/generate-sw-string')(config.serviceWorker);
  const result = template.data();
  console.log(result);
  result
    .then(item => writeFileSync('./test.js', item));
});
