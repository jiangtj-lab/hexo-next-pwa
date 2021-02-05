'use strict';

const generateSWSchema = require('workbox-build/src/options/schema/generate-sw');
const validate = require('workbox-build/src/lib/validate-options');

module.exports = options => {
  options.globDirectory = 'ignore';
  return validate(options, generateSWSchema);
};

