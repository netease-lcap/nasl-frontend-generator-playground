# nasl-frontend-generator-playground

## 安装

```
pnpm i
```

## 试玩

Playground项目分为两部分：
1. 文件服务器。node服务，提供接口负责将源代码写入文件系统。
2. 翻译入口。位于`playground/index.ts`下，它会自动读取`fixtures`文件夹下的`src.json`，翻译为 React 源码后调用文件服务器接口写入`out`目录。

### 启动文件服务器

```
pnpm run server
```

请注意同时只能启动一个文件服务器。

### 启动翻译入口

```
pnpm run translate
```

这个命令会执行`playground/index.ts`文件。并且在这个文件发生改动的时候重新进行翻译过程。

如果一切顺利，你就会在终端看到如下日志：

```
[15:17:09.059] INFO (56852): [compileAsProject] 开始编译静态产物
[15:17:09.059] INFO (56852): [compileAsProject] 载入空项目模板
[15:17:09.059] INFO (56852):
    packageInfo: []
[15:17:09.059] INFO (56852): [downloadDependenciesToProject] 前端依赖库列表
    feExtensions: [
      "@lcap/pc-react-ui@0.0.1"
    ]
[15:17:09.059] INFO (56852): [downloadDependenciesToProject] 开始下载前端依赖库
[15:17:09.060] INFO (56852): [翻译过程] 开始翻译
[15:17:09.147] INFO (56852):
    0: {
      "kind": "standard",
      "name": "@lcap/pc-react-ui",
      "version": "0.0.1"
    }
[15:17:09.147] INFO (56852): [downloadDependenciesToProject] 需要下载的文件
    sources: [
      "packages/@lcap/pc-react-ui@0.0.1/dist-theme/index.js",
      "packages/@lcap/pc-react-ui@0.0.1/dist-theme/index.css"
    ]
[15:17:09.675] INFO (56852): [翻译过程] 翻译结束
[15:17:11.903] INFO (56852): [downloadDependenciesToProject] 依赖库下载完成
    files: [
      {
        "packagePath": "https://minio-api.codewave-test.163yun.com/lowcode-static/packages/@lcap/pc-react-ui@0.0.1",
        "sources": [
          "packages/@lcap/pc-react-ui@0.0.1/dist-theme/index.js",
          "packages/@lcap/pc-react-ui@0.0.1/dist-theme/index.css"
        ],
        "projectPath": "packages/@lcap/pc-react-ui@0.0.1",
        "name": "@lcap/pc-react-ui",
        "version": "0.0.1",
        "kind": "standard"
      }
    ]
[15:17:11.904] INFO (56852): [代码写入] 开始写入debug用文件系统
[15:17:12.004] INFO (56852): [代码写入] 全部写入完成
```

在提示“全部写入完成”后，你可以在`out`目录下查看翻译得到的源码。