/* global hexo */

'use strict';

const config = require('./lib/get-default-config')(hexo);
const { manifest, serviceWorker } = config;

// manifest
require('./lib/manifest')(hexo, manifest);

// serviceWorker
require('./lib/service-worker')(hexo, serviceWorker);

