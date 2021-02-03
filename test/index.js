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
});
