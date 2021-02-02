'use strict';

require('chai').should();

describe('main', () => {
  it('test js-yaml-js-types', () => {
    const fs = require('fs');
    const { join } = require('path');
    const yaml = require('js-yaml');
    const unsafe = require('js-yaml-js-types').all;
    const schema = yaml.DEFAULT_SCHEMA.extend(unsafe);
    const config = yaml.load(fs.readFileSync(join(__dirname, 'default.yaml'), 'utf8'), {schema});
    console.log(config.pwa.serviceWorker.options.runtimeCaching);
  });
});
