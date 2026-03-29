"use strict";

const handleRegExp = require("./handle-regexp");
const { load } = require("js-yaml");
const { readFileSync } = require("fs");
const { join } = require("path");
const { mergeWith } = require("lodash");

module.exports = (ctx) => {
  const defaultConfig = load(
    readFileSync(join(__dirname, "../default.yaml"), "utf8"),
  );
  const config = mergeWith(
    defaultConfig.pwa,
    ctx.config.pwa,
    (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return srcValue;
      }
    },
  );
  config.serviceWorker.options.runtimeCaching.forEach((element) =>
    handleRegExp(element, "urlPattern"),
  );
  return config;
};
