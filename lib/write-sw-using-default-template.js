/* eslint-disable node/no-extraneous-require */
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const bundle = require('workbox-build/src/lib/bundle');
const populateSWTemplate = require('workbox-build/src/lib/populate-sw-template');

module.exports = async ({
  babelPresetEnvTargets,
  cacheId,
  cleanupOutdatedCaches,
  clientsClaim,
  directoryIndex,
  disableDevLogs,
  ignoreURLParametersMatching,
  importScripts,
  inlineWorkboxRuntime,
  manifestEntries,
  mode,
  navigateFallback,
  navigateFallbackDenylist,
  navigateFallbackAllowlist,
  navigationPreload,
  offlineGoogleAnalytics,
  runtimeCaching,
  skipWaiting,
  sourcemap,
  swDest
}) => {

  const unbundledCode = populateSWTemplate({
    cacheId,
    cleanupOutdatedCaches,
    clientsClaim,
    directoryIndex,
    disableDevLogs,
    ignoreURLParametersMatching,
    importScripts,
    manifestEntries,
    navigateFallback,
    navigateFallbackDenylist,
    navigateFallbackAllowlist,
    navigationPreload,
    offlineGoogleAnalytics,
    runtimeCaching,
    skipWaiting
  });

  const files = await bundle({
    babelPresetEnvTargets,
    inlineWorkboxRuntime,
    mode,
    sourcemap,
    swDest,
    unbundledCode
  });

  return files;
};
