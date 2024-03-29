'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const { template } = require('lodash');
const { cyan, magenta } = require('colorette');
const prettyHrtime = require('pretty-hrtime');
const workboxBuild = require('workbox-build');

const buildSW = (hexo, opts) => {
  const start = process.hrtime();
  // This will return a Promise
  return workboxBuild
    .generateSW(Object.assign({
      globDirectory: hexo.public_dir,
      swDest: join(hexo.public_dir, opts.sw)
    }, opts.options))
    .then(({filePaths}) => {
      filePaths.forEach(path => {
        hexo.log.info('Generated: %s', magenta(path));
      });
      const interval = prettyHrtime(process.hrtime(start));
      hexo.log.info('ServiceWorker files generated in %s', cyan(interval));
    });
};

module.exports = (hexo, opts) => {
  const { console, injector } = hexo.extend;
  if (opts.enable) {

    console.register('workbox', 'Generate service-worker files.', {
      options: [
        {name: '-g, --generate', desc: 'Exec hexo generate before workbox build.'}
      ]
    }, (args = {}) => {
      const isGenerate = args.g || args.generate;
      if (isGenerate) {
        hexo.call('generate', {}).then(() => {
          if (!opts.wrapGenerate) {
            buildSW(hexo, opts);
          }
        });
        return;
      }
      buildSW(hexo, opts);
    });

    if (opts.wrapGenerate) {
      console.register('generate', 'Generate static files. (Override by hexo-next-pwa)', {
        options: [
          {name: '-d, --deploy', desc: 'Deploy after generated (due to pwa generate after deploy, sw.js won\'t generated)'},
          {name: '-f, --force', desc: 'Force regenerate'},
          {name: '-w, --watch', desc: 'Watch file changes'},
          {name: '-b, --bail', desc: 'Raise an error if any unhandled exception is thrown during generation'},
          {name: '-c, --concurrency', desc: 'Maximum number of files to be generated in parallel. Default is infinity'}
        ]
      }, (args = {}) => {
        // eslint-disable-next-line node/no-unpublished-require
        const oldGenerate = require('hexo/lib/plugins/console/generate').bind(hexo);
        oldGenerate(args).then(() => {
          hexo.call('workbox');
        });
      });
    }

    if (opts.addScript) {
      if (!hexo.env.cmd || hexo.env.cmd.startsWith('s')) {
        return;
      }
      const compiled = template(readFileSync(join(__dirname, './web-page-script.html'), 'utf8'));
      const url_for = hexo.extend.helper.get('url_for').bind(hexo);
      injector.register('body_end', compiled({sw: url_for(opts.sw)}));
    }
  }
};
