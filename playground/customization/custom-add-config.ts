import { LifeCycleHooksPlugin, ServiceMetaKind, JavaScriptDomain, GeneratorInfrastructureDomain } from "@lcap/nasl-unified-frontend-generator";
import { injectable, inject, Container } from "inversify";
import dedent from "dedent";

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

    afterAllFilesGenerated() {
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

      // 修改vue.config.js
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
  }

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(AddConfigPlugin);

  return container;
}