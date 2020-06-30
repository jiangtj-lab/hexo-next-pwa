'use strict';

module.exports = class DefineCache {
  constructor() {
    this.cache = new Map();
  }
  set(key, val) {
    const defineSet = this.cache.get(key) || new Set();
    defineSet.add(val);
    this.cache.set(key, defineSet);
  }
  toString() {
    return Array.from(this.cache.entries())
      .map(([key, val]) => {
        return `const { ${Array.from(val.values()).join(', ')} } = ${key};`;
      })
      .join('\n');
  }
};
