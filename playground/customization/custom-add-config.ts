import { LifeCycleHooksPlugin, ServiceMetaKind, JavaScriptDomain, GeneratorInfrastructureDomain } from "@lcap/nasl-unified-frontend-generator";
import { injectable, inject, Container } from "inversify";
import dedent from "dedent";
import { readdir, readdirSync, readFile, readFileSync } from "fs";
import path from "path";

export type PackageJSON = Record<string, any>;

export function setupAddConfigToWebpack({container, extensions}: {container: Container, extensions: any}) {
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
      } catch (error) {}
      return undefined;
    }

    private overrideVueConfig() {
      this.fileSystemProvider.write(
        '/m/vue.config.js',
        dedent`const path = require('path');
        const CopyPlugin = require('copy-webpack-plugin');

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
                  }
                ]
              }]);
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

    private createCubeModuleJSON() {
      const packageJSONPath = "/m/package.json";
      const res = this.fileSystemProvider.read(packageJSONPath) ?? "{}";
      const json = JSON.parse(res);
      json.devDependencies["copy-webpack-plugin"] = "^6.4.1";
      this.fileSystemProvider.write(packageJSONPath, JSON.stringify(json, null, 2));
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
      
      // const copyFiles = (source: string, dest: string) => {
      //   const items = readdirSync(source, { withFileTypes: true });
        
      //   items.forEach(item => {
      //     const sourcePath = path.join(source, item.name);
      //     const destPath = path.join(dest, item.name);
          
      //     if (item.isDirectory()) {
      //       // 如果是目录，先创建目录再递归处理
      //       // this.fileSystemProvider.createDirectory(destPath);
      //       copyFiles(sourcePath, destPath);
      //     } else if (item.isFile()) {
      //       // 如果是文件，直接复制
      //       const content = readFileSync(sourcePath, 'utf-8');
      //       this.fileSystemProvider.write(destPath, content);
      //     }
      //   });
      // };

      const content = readFileSync(path.join(__dirname, '../dependences/cordova/android/cordova.js'), 'utf-8');
      this.fileSystemProvider.write('/m/cordova/cordova.js', content);

      // 创建目标目录
      // this.fileSystemProvider.createDirectory(cordovaDestPath);
      // 开始复制
      // copyFiles(path.join(__dirname, cordovaSourcePath), cordovaDestPath);
    }

    afterAllFilesGenerated() {
      // 创建 CubeModule.json
      this.createCubeModuleJSON();

      // 注入cordova插件
      // try {
      //   this.injectCordovaDeps();
      // } catch (error) {
      //   console.log(error);
      // }

      // 修改vue.config.js
      this.overrideVueConfig();
    }
  }

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(AddConfigPlugin);

  return container;
}