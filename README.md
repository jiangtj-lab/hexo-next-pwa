# Hexo NexT PWA

[![](https://img.shields.io/npm/v/@jiangtj/hexo-next-pwa.svg?style=popout-square)](https://www.npmjs.com/package/@jiangtj/hexo-next-pwa)
![npm](https://img.shields.io/npm/l/@jiangtj/hexo-next-pwa.svg?style=popout-square)

## Install

If you use [next](https://github.com/theme-next/hexo-theme-next) or [cake](https://github.com/jiangtj/hexo-theme-cake) theme, just install it.

```bash
yarn add @jiangtj/hexo-next-pwa
```

Others, you need to install hexo5.0 or the latest master branch

## Configure

```yml
pwa:
  # Generate manifest.json
  manifest:
    path: /manifest.json
    # See https://developer.mozilla.org/zh-CN/docs/Web/Manifest
    body:
      # name: Blog
      # short_name: dnocm
      # lang: zh-CN
      # display: standalone
      # background_color: "#ecedee"
      # theme_color: "#414852"
      # icons:
      #   - src: /images/favicon-32.png
      #     sizes: 32x32
      #     type: image/png
      #   - src: /images/favicon-192.png
      #     sizes: 192x192
      #     type: image/png
      #   - src: /images/favicon-512.png
      #     sizes: 512x512
      #     type: image/png
  # Generate sw.js
  serviceWorker:
    cdn: https://cdn.jsdelivr.net/npm/workbox-sw@5/build/workbox-sw.min.js
    # See workbox-build's `generateSW()` API
    # Here are some default configuration, see `./default.yaml`
    options:
      swDest: /sw.js
```

Refer to [the workbox-build's `generateSW()` API](https://developers.google.cn/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW). Some configurations are not supported for the time being. See the compatibility table below.

| feature | status |
| :--- | :--- |
| swDest | ✔ relative to build directory |
| importScripts | ✔ |
| offlineGoogleAnalytics | ✔ |
| runtimeCaching | ✔ |
| globDirectory | ✖ |
| additionalManifestEntries | ✖ |
| babelPresetEnvTargets | ✖ |
| cacheId | plan |
| cleanupOutdatedCaches | ✖ |
| clientsClaim | ✖ |
| directoryIndex | ✖ |
| dontCacheBustURLsMatching | ✖ |
| globFollow | ✖ |
| globIgnores | ✖ |
| globPatterns | ✖ |
| globStrict | ✖ |
| ignoreURLParametersMatching | ✖ |
| inlineWorkboxRuntime | ✖ |
| manifestTransforms | ✖ |
| maximumFileSizeToCacheInBytes | plan |
| mode | ✖ |
| modifyURLPrefix | ✖ |
| navigateFallback | ✖ |
| navigateFallbackDenylist | ✖ |
| navigateFallbackAllowlist | ✖ |
| navigationPreload | ✖ |
| skipWaiting | plan |
| sourcemap | ✖ |
| templatedURLs | ✖ |

