'use strict';

require('chai').should();
const Hexo = require('hexo');
// eslint-disable-next-line no-unused-vars
const hexo = new Hexo(__dirname, { silent: true });
const { load } = require('js-yaml');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const defaultYaml = readFileSync(resolve(__dirname, '../default.yaml'), 'utf8');
const defaultConfig = () => {
  return load(defaultYaml).pwa;
};

try {
  mkdirSync('test/temp');
} catch (ignore) {}

describe('main', () => {
  it('generate-sw-string() with default', () => {
    const { serviceWorker } = defaultConfig();
    const template = require('../lib/generate-sw-string')(serviceWorker);
    template.path.should.eql(serviceWorker.options.swDest);
    template.data()
      .then(item => writeFileSync('./test/temp/sw-default.js', item));
  });

  it('generate-sw-string() with offlineGoogleAnalytics', () => {
    const { serviceWorker } = defaultConfig();
    Object.assign(serviceWorker.options, {
      offlineGoogleAnalytics: true
    });
    const template = require('../lib/generate-sw-string')(serviceWorker);
    template.data()
      .then(item => writeFileSync('./test/temp/sw-analytics.js', item));
  });
});
