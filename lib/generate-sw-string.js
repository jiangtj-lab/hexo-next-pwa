'use strict';

const getStringHash = require('./get-string-hash');
const writeServiceWorkerUsingDefaultTemplate = require('./write-sw-using-default-template');

module.exports = async (locals, options) => {
  // console.log(locals);
  const pages = locals.pages.toArray();

  const manifestEntries = pages.map(item => ({
    url: item.path,
    revision: getStringHash(item.content)
  }));

  const files = await writeServiceWorkerUsingDefaultTemplate(Object.assign({
    manifestEntries
  }, options));

  return {files};
};
