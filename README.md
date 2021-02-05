# Hexo NexT PWA

[![](https://img.shields.io/npm/v/@jiangtj/hexo-next-pwa.svg?style=popout-square)](https://www.npmjs.com/package/@jiangtj/hexo-next-pwa)
![npm](https://img.shields.io/npm/l/@jiangtj/hexo-next-pwa.svg?style=popout-square)

## Install

```bash
yarn add @jiangtj/hexo-next-pwa
```

**Require:** hexo5+ **or** [next](https://github.com/theme-next/hexo-theme-next)/[cake](https://github.com/jiangtj/hexo-theme-cake) theme

## Configure

I added some default configurations, see [default.yaml](default.yaml)

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
    precache:
      # precache posts url
      posts:
        enable: true
        sort: -date
        limit: 10
      # precache pages url
      pages: true
    options:
      # sw file path
      swDest: /sw.js
```

`serviceWorker.precache` define how to precache url.

`serviceWorker.options` refer to [the workbox-build's `generateSW()` API](https://developers.google.cn/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW). Some configurations are not supported, due to the precache manifest is generated in different ways.

| options | compatibility |
| :--- | :--- |
| swDest | relative to build directory |
| globDirectory | ✖ |
| dontCacheBustURLsMatching | ✖ |
| globFollow | ✖ |
| globIgnores | ✖ |
| globPatterns | ✖ |
| globStrict | ✖ |
| manifestTransforms | ✖ |
| maximumFileSizeToCacheInBytes | ✖ |
| modifyURLPrefix | ✖ |
| templatedURLs | ✖ |
| other options | ✔ |
