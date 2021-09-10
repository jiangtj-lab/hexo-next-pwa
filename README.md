# Hexo NexT PWA

[![](https://img.shields.io/npm/v/@jiangtj/hexo-next-pwa.svg?style=popout-square)](https://www.npmjs.com/package/@jiangtj/hexo-next-pwa)
![npm](https://img.shields.io/npm/l/@jiangtj/hexo-next-pwa.svg?style=popout-square)

## Install

```bash
yarn add @jiangtj/hexo-next-pwa
```

## Important

- hexo version **require >= 5.0**
- **not work** in `hexo s`, please exec `hexo g` and serve public dir by other tool (e.g. `serve public`)

## Configure

I added some default configurations, see [default.yaml](default.yaml)

```yml
pwa:
  # Generate manifest.json
  manifest:
    enable: true
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
    enable: true
    sw: /sw.js
    # add <script> if ('serviceWorker' in navigator) {...}</script> to your html file
    addScript: true
    # auto exec hexo workbox after generate, If you customize generate, please set it to false
    wrapGenerate: true
    options:
      # see [the workbox-build's `generateSW()` API](https://developers.google.cn/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW)
```

## Console

```bash
hexo workbox [-g]
```
- `-g`: auto exec hexo generate before workbox build.

This is very useful. If you disable the `wrapGenerate` option, it allows you to directly generate `sw.js`, but you need to be aware that you need to execute `hexo generate` before.

## Explain

### Difference from hexo-pwa

Initially, hexo-next-pwa was a fork of hexo-pwa, so you can see that they have similar options, but due to several revisions, the current hexo-next-pwa has been very different from hexo-pwa

### Why is it publish in the @jiangtj scope?

In fact, I don’t know much about pwa. It (this plugin) relies on the internal api of workbox. I doubt whether I can maintain this plugin. Anyway, my blog depends on it. In the short term, I don’t Will give up :joy:

