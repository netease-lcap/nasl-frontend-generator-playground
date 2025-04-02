import { LifeCycleHooksPlugin, ServiceMetaKind, JavaScriptDomain, GeneratorInfrastructureDomain } from "@lcap/nasl-unified-frontend-generator";
import { injectable, inject, Container } from "inversify";
import dedent from "dedent";
import { readdir, readdirSync, readFile, readFileSync } from "fs";
import path from "path";
// @ts-ignore
import loaderUtils from 'loader-utils';

export type PackageJSON = Record<string, any>;

export function setupAddConfigToWebpack({ container, extensions }: { container: Container, extensions: any }) {
  @injectable()
  class AddConfigPlugin extends LifeCycleHooksPlugin {
    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
      @inject(ServiceMetaKind.NpmPackageJSONManager)
      private npmPackageJSONManagerPlugin: JavaScriptDomain.FrontendApplicationDomain.NpmPackageJSONManager,
    ) {
      super(fileSystemProvider);
    }

    private packageJSONPath = "/m/package.json";
    private readPkg(): PackageJSON | undefined {
      try {
        const pkg = this.fileSystemProvider.read(this.packageJSONPath);
        if (pkg) {
          return JSON.parse(pkg);
        }
      } catch (error) { }
      return undefined;
    }

    private overrideVueConfig() {
      this.fileSystemProvider.write(
        '/m/vue.config.js',
        dedent`const path = require('path');
        const CopyPlugin = require('copy-webpack-plugin');
        const fs = require('fs');
        const glob = require('glob');

        // 获取package-config文件路径
        const getPackageConfigPath = () => {
          const files = glob.sync('package-config.*.js');
          return files[0];
        };

        module.exports = {
          configureWebpack(config) {
            if (process.env.NODE_ENV === "production") {
              config.devtool = false;
            }
          },
          chainWebpack: config => {
            config.plugin('copy')
              .use(CopyPlugin, [{
                patterns: [
                  {
                    from: path.resolve(__dirname, 'CubeModule.json'),
                    to: path.resolve(__dirname, 'dist'),
                  },
                  {
                    from: path.resolve(__dirname, 'cordova'),
                    to: path.resolve(__dirname, 'dist/cordova'),
                  },
                  {
                    from: path.resolve(__dirname, 'cordova/cordova.js'),
                    to: path.resolve(__dirname, 'dist'),
                  },
                  {
                    from: path.resolve(__dirname, getPackageConfigPath()),
                    to: path.resolve(__dirname, 'dist/' + getPackageConfigPath()),
                  },
                ]
              }]);

            // 修改html-webpack-plugin模板
            config.plugin('html')
              .tap(args => {
                args[0].packageConfig = getPackageConfigPath();
                return args;
              });
          },
          lintOnSave: false,
          runtimeCompiler: true,
          devServer: {
            port: 8810,
            proxy: {
              "/assets": {
                target: "http://localhost:8080",
                changeOrigin: true,
                autoRewrite: true,
              },
              "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                autoRewrite: true,
              },
              "/rest": {
                target: "http://localhost:8080",
                changeOrigin: true,
                autoRewrite: true,
              },
              "^/gateway/": {
                target: "http://localhost:8080",
                changeOrigin: true,
                autoRewrite: true,
              },
              "^/gw/": {
                target: "http://localhost:8080",
                changeOrigin: true,
                autoRewrite: true,
              },
            },
          },
        };`
      );
    }

    private overrideHTML() {
      this.fileSystemProvider.write(
        '/m/public/index.html',
        dedent`<!DOCTYPE html>
        <html lang="">

        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
          <link rel="icon" href="<%= BASE_URL %>favicon.ico">
          <title>
            <%= htmlWebpackPlugin.options.title %>
          </title>
          <script src="<%= htmlWebpackPlugin.options.packageConfig %>"></script>
          <style>
            body,
            html,
            #app {
              width: 100%;
              height: 100%;
            }
          </style>

          <!-- 引入样式 -->
          <!-- <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css"> -->

        </head>

        <body>
          <noscript>
            <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
                Please enable it to continue.</strong>
          </noscript>
          <div id="app"></div>


          <!-- built files will be auto injected -->
          <!-- 引入组件库 -->
          <!-- <script src="http://static-vusion.163yun.com/packages/lcap-login@1.0.4/dist-theme/index.js"></script> -->
        </body>

        <style id="theme">
          
        </style>

        </html>`
      );
    }


    private updatePackageJSON() {
      const packageJSONPath = "/m/package.json";
      const res = this.fileSystemProvider.read(packageJSONPath) ?? "{}";
      const json = JSON.parse(res);
      json.devDependencies["copy-webpack-plugin"] = "^6.4.1";
      json.devDependencies["glob"] = "^11.0.1";
      this.fileSystemProvider.write(packageJSONPath, JSON.stringify(json, null, 2));
    }

    private createCubeModuleJSON() {
      // 获取package.json信息
      const packageJson = this.readPkg();
      // 获取build和version信息
      // 创建CubeModule.json
      this.fileSystemProvider.write(
        '/m/CubeModule.json',
        JSON.stringify({
          name: packageJson?.name,
          identifier: packageJson?.name,
          build: extensions.times ?? 2,
          version: extensions.times ?? '1.0.0',
        }, null, 2)
      );
    }

    private injectCordovaDeps() {
      const cordovaSourcePath = '../dependences/cordova';
      const cordovaDestPath = '/m/cordova';

      const copyFiles = (source: string, dest: string) => {
        const items = readdirSync(source, { withFileTypes: true });

        items.forEach(item => {
          const sourcePath = path.join(source, item.name);
          const destPath = path.join(dest, item.name);

          if (item.isDirectory()) {
            // 如果是目录，先创建目录再递归处理
            copyFiles(sourcePath, destPath);
          } else if (item.isFile()) {
            // 如果是文件，直接复制
            const content = readFileSync(sourcePath, 'utf-8');
            this.fileSystemProvider.write(destPath, content);
          }
        });
      };

      copyFiles(path.join(__dirname, cordovaSourcePath), cordovaDestPath);
    }

    private injectPackageConfig() {
      const packageJson = this.readPkg();
      const content = {
        name: packageJson?.name,
        identifier: packageJson?.name,
        build: extensions.times ?? 2,
        version: extensions.times ?? '1.0.0',
      };
      const buff = Buffer.from(JSON.stringify(content))
      const hash = loaderUtils.getHashDigest(buff, 'md5', 'hex', 8)
      this.fileSystemProvider.write(
        `/m/package-config.${hash}.js`,
        dedent`
          window.PACKAGE_CONFIG = ${JSON.stringify(content, null, 2)};
        `
      );
    }

    afterAllFilesGenerated() {
      // 创建 CubeModule.json
      this.createCubeModuleJSON();

      // 注入cordova插件
      this.injectCordovaDeps();

      // 注入package-config.json
      this.injectPackageConfig();

      // 修改package.json
      this.updatePackageJSON();

      // 修改vue.config.js
      this.overrideVueConfig();

      // 修改index.html
      this.overrideHTML();
    }
  }

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(AddConfigPlugin);

  return container;
}