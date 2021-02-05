'use strict';

module.exports = (element, ...props) => {
  for (const prop of props) {
    const val = element[prop];
    if (typeof val === 'string') {
      if (val.startsWith('regexp:')) {
        element[prop] = new RegExp(val.substring(7));
      }
    }
  }
};

