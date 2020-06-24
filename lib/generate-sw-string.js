'use strict';

const ejs = require('ejs');
const { resolve } = require('path');

module.exports = serviceWorker => {
  console.log(serviceWorker);
  const options = Object.assign({
    workbox_cdn: serviceWorker.workbox_cdn,
    disableDevLogs: false
  }, serviceWorker.options);

  return {
    path: serviceWorker.path,
    data: () => {
      return ejs.renderFile(resolve(__dirname, '../templates/sw-template.ejs'), options);
    }
  };
};
