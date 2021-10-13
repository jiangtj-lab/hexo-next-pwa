'use strict';

require('chai').should();

const Hexo = require('hexo');
const hexo = new Hexo(__dirname, { silent: true });
const { readFileSync } = require('fs');
const { join } = require('path');

describe('main', () => {
  it('test js-yaml-js-types', () => {
    const yaml = require('js-yaml');
    const schema = require('../lib/get-yaml-schema')(hexo);
    const config = yaml.load(readFileSync(join(__dirname, 'js-yaml-js-types.yaml'), 'utf8'), { schema });
    config.should.eql({ urlPattern: /\.(?:js|css)$/ });
  });

  it('test default config', () => {
    const config = require('../lib/get-default-config')(hexo);
    const { runtimeCaching } = config.serviceWorker.options;
    runtimeCaching[0].should.eql({
      urlPattern: '/',
      handler: 'NetworkFirst',
      options: { cacheName: 'index' }
    });
    runtimeCaching[1].should.eql({
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'js-css' }
    });
  });

  it('test colorette', () => {
    const { cyan, magenta } = require('colorette');
    console.log('Generated: %s', magenta('C:\\Users'));
    console.log('ServiceWorker files generated in %s', cyan('1s'));
  });
});
