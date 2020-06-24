/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@5/build/workbox-sw.min.js');



workbox.routing.registerRoute(/\//, new workbox.strategies.NetworkFirst({"cacheName":"index","plugins":{"aaa":"plugins"}}), 'GET')
workbox.routing.registerRoute(/\.(?:js|css)$/, new workbox.strategies.StaleWhileRevalidate({"cacheName":"js-css","plugins":{"aaa":"plugins"}}), 'GET')
workbox.routing.registerRoute(/\.(?:png|gif|jpg|jpeg|svg)$/, new workbox.strategies.CacheFirst({"cacheName":"images","plugins":{"aaa":"plugins"}}), 'GET')
workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com/, new workbox.strategies.StaleWhileRevalidate({"cacheName":"google-fonts-stylesheets","plugins":{"aaa":"plugins"}}), 'GET')
workbox.routing.registerRoute(/^https:\/\/fonts\.gstatic\.com/, new workbox.strategies.CacheFirst({"cacheName":"google-fonts-webfonts","plugins":{"aaa":"plugins"}}), 'GET')


