import { 
  LifeCycleHooksPlugin, 
  ServiceMetaKind, 
  JavaScriptDomain, 
  GeneratorInfrastructureDomain,
  CommonAppConfig 
} from "@lcap/nasl-unified-frontend-generator";
import { injectable, inject, Container } from "inversify";
import dedent from "dedent";
import { readdirSync, readFileSync } from "fs";
import path from "path";
// @ts-ignore
import loaderUtils from 'loader-utils';
import md5 from 'md5';
import type { App, Frontend } from '@lcap/nasl-concepts';

export type PackageJSON = Record<string, any>;

export function setupAddConfigToWebpack(container: Container) {
  
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

    private overrideVueConfig() {
      this.fileSystemProvider.write(
        '/vue.config.js',
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
          publicPath: '',
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
        '/public/index.html',
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
      // MOCK
      // const packageJSONPath = "/m/package.json";
      const packageJSONPath = "/package.json";
      const res = (this.fileSystemProvider.read(packageJSONPath) ?? "{}") as string;
      const json = JSON.parse(res);
      json.devDependencies["copy-webpack-plugin"] = "^6.4.1";
      json.devDependencies["glob"] = "^11.0.1";
      this.fileSystemProvider.write(packageJSONPath, JSON.stringify(json, null, 2));
    }

    private createCubeModuleJSON(times: number) {
      // 获取build和version信息
      // 创建CubeModule.json
      this.fileSystemProvider.write(
        '/CubeModule.json',
        JSON.stringify({
          name: this.appName,
          identifier: this.appName,
          build: times ? times + 1 : 1,
          version: times ? `1.0.${times  + 1}` : '1.0.0',
        }, null, 2)
      );
    }

    private injectCordovaDeps() {
      const cordovaSourcePath = './dependences/cordova';
      const cordovaDestPath = '/cordova';

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

    private injectPackageConfig(times: number) {
      const content = {
        name: this.appName,
        identifier: this.appName,
        build: times ? times + 1 : 1,
        version: times ? `1.0.${times  + 1}` : '1.0.0',
      };
      const buff = Buffer.from(JSON.stringify(content))
      const hash = loaderUtils.getHashDigest(buff, 'md5', 'hex', 8)
      this.fileSystemProvider.write(
        `/package-config.${hash}.js`,
        dedent`
          window.PACKAGE_CONFIG = ${JSON.stringify(content, null, 2)};
        `
      );
    }
    private appId = '';
    private appName = '';
    private host = '';
    preProcess(app: App, frontend: Frontend, config: CommonAppConfig) {
      this.appId = app.id;
      this.appName = app.name;
      const configGroups = app.configuration.groups || [];
      const customConfig = configGroups.find((group) => group.name === 'custom')?.properties || [];
      this.host = customConfig.find((item) => item.name === 'h5Host')?.values?.find((item) => item.env === 'online')?.value || '';
      return { app, frontend, config };
    }

    injectHostConfig() {
      // MOCK
      // const platformConfigPath = '/m/src/platform.config.json';
      const platformConfigPath = '/src/platform.config.json';
      const res = (this.fileSystemProvider.read(platformConfigPath) ?? "{}") as string;
      const json = JSON.parse(res);
      json.sysPrefixPath = this.host;
      this.fileSystemProvider.write(platformConfigPath, JSON.stringify(json, null, 2));
    }

    async getBuildTimes() {
      let times = '';
      try {
        const ak = 'testAk';
        const timestamp = `${Math.floor(Date.now() / 1000)}`;
        const signature = md5(ak + 'ajkdhfulzkjbnflakqlkbalkdhfz' + timestamp);
        const res = await fetch(
          // TODO
          // `http://openapi.boe.com.cn/rest/exportCount?appId=${this.appId}`,
          `http://lc-svc-openapi-online-boe-1.ns-boe:8080/rest/exportCount?appId=${this.appId}`,
          {
            method: 'GET',
            headers: {
              ak,
              timestamp,
              signature,
            },
          });
        times = await res.text();
      } catch (e) {
        console.log(e);
      }
      return times ? parseInt(times) : 1;
    }

    async afterAllFilesGenerated() {
      const times = await this.getBuildTimes();

      // 创建 CubeModule.json
      this.createCubeModuleJSON(times);

      // 注入cordova插件
      this.injectCordovaDeps();

      // 注入package-config.json
      this.injectPackageConfig(times);

      // 注入host 
      this.injectHostConfig();

      // 修改package.json
      this.updatePackageJSON();

      // 修改vue.config.js
      this.overrideVueConfig();

      // 修改index.html
      this.overrideHTML();
    }
  }

  // 创建一个插件实例并直接绑定，确保使用同一个实例
  const pluginInstance = new AddConfigPlugin(
    container.get(ServiceMetaKind.FileSystemProvider),
    container.get(ServiceMetaKind.NpmPackageJSONManager),
  );

  container.bind(ServiceMetaKind.IRPreProcesser).toConstantValue(pluginInstance);
  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .toConstantValue(pluginInstance);

  return container;
}