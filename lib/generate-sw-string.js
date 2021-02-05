'use strict';

const getStringHash = require('./get-string-hash');
const writeServiceWorkerUsingDefaultTemplate = require('./write-sw-using-default-template');

module.exports = async (locals, serviceWorker) => {

  const { precache, options } = serviceWorker;
  const { pages, posts } = locals;

  const manifestEntries = [];

  if (precache.posts.enable) {
    posts.sort(precache.posts.sort)
      .limit(precache.posts.limit)
      .forEach(item => {
        manifestEntries.push({
          url: item.path,
          revision: getStringHash(item.content)
        });
      });
  }

  if (precache.pages) {
    pages.forEach(item => {
      manifestEntries.push({
        url: item.path,
        revision: getStringHash(item.content)
      });
    });
  }

  const files = await writeServiceWorkerUsingDefaultTemplate(Object.assign({
    manifestEntries
  }, options));

  return {files};
};
