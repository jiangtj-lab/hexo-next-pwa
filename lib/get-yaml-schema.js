'use strict';

const yaml = require('js-yaml');

module.exports = ctx => {
  let schema = yaml.DEFAULT_SCHEMA;
  try {
    const { all } = require('js-yaml-js-types');
    schema = yaml.DEFAULT_SCHEMA.extend(all);
  } catch (ignore) {
    ctx.log.debug('Can not get js-yaml-js-types, please use regexp: prefix!');
  }
  return schema;
};

