'use strict';

module.exports = (hexo, opts) => {
  const { generator, injector } = hexo.extend;
  if (opts.enable) {
    injector.register('head_end', `<link rel="manifest" href="${opts.path}" />`);
    generator.register('pwa_manifest', () => {
      return {
        path: opts.path,
        data: JSON.stringify(
          Object.assign({
            name: hexo.config.title,
            start_url: hexo.config.url
          }, opts.body)
        )
      };
    });
  }
};
