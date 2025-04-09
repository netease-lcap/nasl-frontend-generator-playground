# nasl-frontend-generator-playground

## 安装

推荐在Node v18.19.0下使用pnpm安装：

```
pnpm i
```

## 试玩

### 简介

Playground项目翻译入口。位于`playground/debug.ts`下，它会根据`.env`中定义的`NASL_ZLIB_PATH`环境变量寻找NASL数据文件，翻译为应用源码后写入`out`目录。

目录结构含义如下：

```
.
├── README.md                                    # 脚手架说明文档
├── dist                                         # 打包后的插件。未打包前可能为空
│   ├── README.md
│   ├── description.json
│   └── plugin.js                                # 打包后的插件 js
├── out                                          # 调试结果的输出目录
├── nodemon.json 
├── package.json
├── playground                                   # 脚手架代码目录
│   ├── container.ts                             # 构建插件系统依赖注入容器，是用户插件的总入口
│   ├── customization                            # 用户自定义插件的目录
│   │   ├── custom-compiler.ts                   # 插件使用示例：定制前端打包工具(脚手架)
│   │   ├── custom-eslint.ts                     # 插件使用示例：增加eslint
│   │   ├── custom-microfrontend.ts              # 插件使用示例：修改微前端框架
│   │   ├── custom-npm-package.ts                # 插件使用示例：修改package.json中的npm包
│   │   ├── custom-project-layout.ts             # 插件使用示例：修改项目结构
│   │   └── customize-performance.ts             # 插件使用示例：优化前端性能
│   ├── debug.ts                                 # 调试入口文件
│   ├── envs.ts                                  # 环境变量
│   ├── fixtures                                 # 预置的应用NASL
│   │   ├── b0fb29f7-9cf3-4f47-b49d-4935183aaa66 # 应用1 NASL
│   │   │   └── annotation-1718699989055
│   │   └── e6196626-e639-4d52-b6f1-f1ed00eef706 # 应用2 NASL
│   │       └── annotation-1716975881205
│   ├── index.ts
│   ├── translate.ts
│   ├── types.ts
│   └── utils.ts
├── plugin.zip                                   # 打包后的插件压缩包
├── pnpm-lock.yaml
├── public                                       # 用户插件包的静态文件目录
│   ├── README.md                                # 插件包的说明文档
│   └── description.json                         # 插件包的描述文件
├── rsbuild.config.ts
├── scripts                                      # 辅助打包插件的代码
│   ├── build-plugin.ts
│   └── test-plugin.ts
└── tsconfig.json
```

### 环境变量文件创建

如果你在仓库根目录下没有`.env`文件，需要将`.env.template`复制到`.env`。

你通常还需要修改`NASL_ZLIB_PATH="/Users/suicca/workspace/nasl-frontend-generator-playground/playground/fixtures/b0fb29f7-9cf3-4f47-b49d-4935183aaa66/annotation-1718699989055"`的值，以指向你本地的`fixtures`文件下的同名数据。

### 启动翻译入口

```
pnpm dev
```

这个命令会执行`playground/debug.ts`文件。并且在这个文件发生改动的时候重新进行翻译过程。

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

### 调试翻译过程

项目根目录下的`.vscode/launch.json`文件中，包含一份名为`启动翻译过程调试`的调试配置。

你可以在VSCode的调试菜单中启动调试。

推荐你一开始可以先尝试以`playground/translate.ts`中的`compileAsProject`函数调用为入口进行调试。

### 翻译器插件的入口

插件的入口在`playground/container.ts`中的`applyCustomization`函数。

这个函数的作用是返回注入了需要在翻译流程中用到的翻译器插件的容器。在真正翻译的时候，会调用`applyCustomization`函数。

因此，只需要在`applyCustomization`函数中注入你的插件或对已经注入的插件作修改，就能够改变翻译的行为。

如下，它启用了三个插件：

1. setupPerformanceOptions
2. setupNpmPackages
3. setupCompilerToWebpack

```ts
import { setupPerformanceOptions } from "./customization/customize-performance";
import { setupNpmPackages } from "./customization/custom-npm-package";
import { setupCompilerToWebpack } from "./customization/custom-compiler";

export async function applyCustomization(container: Container) {
  return Promise.resolve(container)
    .then(setupPerformanceOptions)
    .then(setupNpmPackages)
    .then(setupCompilerToWebpack);
}
```

### 翻译器插件的打包

使用`pnpm build:plugin`命令可以从当前翻译器插件入口，打包翻译器插件，打包成功后，会出现一个`plugin.zip`文件。

将这个文件上传到插件管理中，就可以使用这个插件了。

## 常见问题

### 报错: NASL_ZLIB_PATH未设置

> 症状：报错 NASL_ZLIB_PATH 未设置。

解决方案：
翻译器会从`.env`文件中读取环境变量。

1. 请检查是否存在此文件；
2. 此文件中的`NASL_ZLIB_PATH`是否有值，以及是否指向存在的文件。

### 报错: Blob is not defined

> 症状：报错`ReferenceError: Blob is not defined`。

解决方案:
1. 请使用node.js>=18再试。