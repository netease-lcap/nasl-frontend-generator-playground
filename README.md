# nasl-frontend-generator-playground

## 安装

推荐在Node v18.19.0下使用pnpm安装：

```
pnpm i
```

## 试玩

Playground项目翻译入口。位于`playground/debug.ts`下，它会根据`.env`中定义的`NASL_ZLIB_PATH`环境变量寻找NASL数据文件，翻译为应用源码后写入`out`目录。

### 启动文件服务器

```
pnpm serve
```

请注意同时只能启动一个文件服务器。

### 启动翻译入口

```
pnpm dev
```

这个命令会执行`playground/index.ts`文件。并且在这个文件发生改动的时候重新进行翻译过程。

如果一切顺利，你就会在终端看到如下日志：

```
[19:19:25.743] INFO (5585): [翻译] 开始翻译
[19:19:25.806] INFO (5585): [compileAsProject] 开始翻译代码
[19:19:25.806] INFO (5585): [compileAsProject] 启用制品日志插件
[19:19:25.806] INFO (5585): [compileAsProject] 载入项目模板
[19:19:25.808] INFO (5585):
    packageInfo: [
      {
        "ui": [
          {
            "frameworkKind": "vue2",
            "frameworkVersion": "vue@2.6.12",
            "libName": "CloudUI",
            "useFakeRoot": "0",
            "name": "@lcap/pc-ui",
            "version": "1.0.0"
          },
          {
            "frameworkKind": "react",
            "frameworkVersion": "react@18.2.0",
            "name": "@lcap/pc-react-ui",
            "version": "1.1.0"
          }
        ],
        "template": [
          {
            "frameworkKind": "vue2",
            "name": "@lcap/pc-template",
            "version": "1.3.0"
          },
          {
            "frameworkKind": "react",
            "name": "@lcap/react-template",
            "version": "1.0.0"
          }
        ],
        "scope": "pc"
      },
      {
        "ui": [
          {
            "frameworkKind": "vue2",
            "frameworkVersion": "vue@2.6.12",
            "name": "@lcap/mobile-ui",
            "version": "1.0.0"
          }
        ],
        "template": [
          {
            "frameworkKind": "vue2",
            "name": "@lcap/mobile-template",
            "version": "1.3.0"
          }
        ],
        "scope": "h5"
      }
    ]
[19:19:25.808] INFO (5585): [downloadDependenciesToProject] 前端依赖库列表
    feExtensions: [
      "@lcap/pc-react-ui@1.0.0"
    ]
[19:19:25.808] INFO (5585): [downloadDependenciesToProject] 开始下载前端依赖库
[19:19:25.808] INFO (5585): [downloadDependenciesToProject] 下载依赖库
    ext: {
      "name": "@lcap/pc-react-ui",
      "version": "1.0.0",
      "kind": "standard"
    }
[19:19:25.808] INFO (5585): [翻译过程] 开始翻译
[19:19:25.848] INFO (5585):
    0: {
      "kind": "standard",
      "name": "@lcap/pc-react-ui",
      "version": "1.0.0"
    }
[19:19:25.848] INFO (5585): [downloadDependenciesToProject] 下载文件列表
    urls: [
      "https://minio-api.codewave-test.163yun.com/lowcode-static/packages/@lcap/pc-react-ui@1.0.0/dist-theme/index.js",
      "https://minio-api.codewave-test.163yun.com/lowcode-static/packages/@lcap/pc-react-ui@1.0.0/dist-theme/index.css"
    ]
[19:19:26.197] INFO (5585): [翻译过程] 翻译结束
[19:19:27.631] INFO (5585): [downloadDependenciesToProject] 依赖库下载完成
[19:19:27.631] INFO (5585): [compileAsProject] 启用全局前缀: sysPrefixPath = /wdk-dev
[19:19:27.632] INFO (5585): [compileAsProject] rspack配置
    publicPath: "//minio-api.codewave-test.163yun.com/lowcode-static/csautotest/b0fb29f7-9cf3-4f47-b49d-4935183aaa66/dev/test/"
    backendUrl: "http://dev.aasdasd.csautotest.lcap.codewave-test.163yun.com/wdk-dev"
[19:19:27.646] INFO (5585):
    0: "/pc/README.md"
    1: "/pc/client-lazyload-template.js"
    2: "/pc/index.html"
    3: "/pc/package.json"
    4: "/pc/pnpm-lock.yaml"
    5: "/pc/public/vite.svg"
    6: "/pc/rspack.config.js"
    7: "/pc/src/Hooks.tsx"
    8: "/pc/src/Router.tsx"
    9: "/pc/src/entry/helper.tsx"
    10: "/pc/src/entry/index.tsx"
    11: "/pc/src/index.css"
    12: "/pc/src/init.ts"
    13: "/pc/src/main.tsx"
    14: "/pc/src/nasl.ts"
    15: "/pc/src/router/component.tsx"
    16: "/pc/src/router/hooks.tsx"
    17: "/pc/src/vite-env.d.ts"
    18: "/pc/src/packages/@lcap/pc-react-ui@1.0.0/dist-theme/index.css"
    19: "/pc/src/packages/@lcap/pc-react-ui@1.0.0/dist-theme/index.js"
    20: "/pc/src/apis.tsx"
    21: "/pc/src/pages/Page2.tsx"
    22: "/pc/src/pages/Ww.tsx"
    23: "/pc/src/components/FrontendEventWrapper.tsx"
    24: "/pc/src/platform.config.ts"
    25: "/pc/src/global-variables.tsx"
    26: "/pc/tsconfig.json"
[19:19:27.646] INFO (5585): [翻译] 写入文件
    0: "/pc/README.md"
    1: "/pc/client-lazyload-template.js"
    2: "/pc/index.html"
    3: "/pc/package.json"
    4: "/pc/pnpm-lock.yaml"
    5: "/pc/public/vite.svg"
    6: "/pc/rspack.config.js"
    7: "/pc/src/Hooks.tsx"
    8: "/pc/src/Router.tsx"
    9: "/pc/src/entry/helper.tsx"
    10: "/pc/src/entry/index.tsx"
    11: "/pc/src/index.css"
    12: "/pc/src/init.ts"
    13: "/pc/src/main.tsx"
    14: "/pc/src/nasl.ts"
    15: "/pc/src/router/component.tsx"
    16: "/pc/src/router/hooks.tsx"
    17: "/pc/src/vite-env.d.ts"
    18: "/pc/src/packages/@lcap/pc-react-ui@1.0.0/dist-theme/index.css"
    19: "/pc/src/packages/@lcap/pc-react-ui@1.0.0/dist-theme/index.js"
    20: "/pc/src/apis.tsx"
    21: "/pc/src/pages/Page2.tsx"
    22: "/pc/src/pages/Ww.tsx"
    23: "/pc/src/components/FrontendEventWrapper.tsx"
    24: "/pc/src/platform.config.ts"
    25: "/pc/src/global-variables.tsx"
    26: "/pc/tsconfig.json"
[19:19:27.646] INFO (5585): [代码写入] 开始写入output目录
[19:19:27.665] INFO (5585): [代码写入] 全部写入完成
[19:19:27.665] INFO (5585): [翻译] 翻译结束
```

在提示"全部写入完成"后，你可以在`out`目录下查看翻译得到的源码。

提示：
翻译的过程中会从内部的测试环境下载依赖库（React组件库等），如果在执行翻译的时候无法访问网易内部测试环境，翻译能够正常完成，但是得到的源码中会缺少这些依赖库。