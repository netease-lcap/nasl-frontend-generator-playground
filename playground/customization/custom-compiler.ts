import {
  LifeCycleHooksPlugin,
  ServiceMetaKind,
  GeneratorInfrastructureDomain,
  JavaScriptDomain,
} from "@lcap/nasl-unified-frontend-generator";
import dedent from "dedent";
import { injectable, inject, Container } from "inversify";

export function setupCompilerToWebpack(container: Container) {
  @injectable()
  class MyCompilerPlugin extends LifeCycleHooksPlugin {
    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
      @inject(ServiceMetaKind.NpmPackageJSONManager)
      private npmPackageJSONManagerPlugin: JavaScriptDomain.FrontendApplicationDomain.NpmPackageJSONManager,
      @inject(ServiceMetaKind.FrontendBundlerConfig)
      private frontendBundlerConfigPlugin: JavaScriptDomain.FrontendApplicationDomain.FrontendBundlerConfig
    ) {
      super(fileSystemProvider);
    }
    afterAllFilesGenerated(): void {
      this.npmPackageJSONManagerPlugin.patch({
        scripts: {
          dev: "webpack serve --open",
          build: "webpack",
        },
        devDependencies: {
          webpack: "5.92.1",
          "webpack-cli": "5.1.4",
          "webpack-dev-server": "5.0.4",
          "html-webpack-plugin": "5.6.0",
          "@pmmmwh/react-refresh-webpack-plugin": "0.5.15",
          "swc-loader": "0.2.6",
          "style-loader": "4.0.0",
          "css-loader": "7.1.2",
        },
      });

      const { backendUrl, publicPath, aliasMapStr } =
        this.frontendBundlerConfigPlugin.getCompilerConfig();
      this.fileSystemProvider.write(
        "/webpack.config.js",
        dedent`
          const path = require('path');
          const HtmlWebpackPlugin = require('html-webpack-plugin');

          const isDev = process.env.NODE_ENV === 'development';
          // 会被替换成真实服务端地址，形如 http://dev.pagetest.defaulttenant.lcap.hatest.163yun.com
          const backendUrl = '${backendUrl}';
          // 会被替换成真实publicPath，形如 '//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/48bab4da-9671-4e27-9411-bcdb41cd16e4/dev'
          const publicPath = '${publicPath}';

          module.exports = {
            mode: isDev ? 'development' : 'production',
            context: __dirname,
            entry: {
              main: {
                import: './src/main.tsx',
              },
            },
            output: {
              publicPath: isDev ? '/' : publicPath,
              filename: '[name].[contenthash].js',
            },
            optimization: {
              splitChunks: {
                chunks: 'all',
              }
            },
            resolve: {
              extensions: ['...', '.ts', '.tsx', '.jsx'],
              alias: {${aliasMapStr}},
            },
            devServer: {
              port: 8810,
              historyApiFallback: true,
              proxy: [
                {
                  context: ['/assets', '/api', '/rest', '/gateway/', '/gw/', '/upload'],
                  target: backendUrl,
                  changeOrigin: true,
                  autoRewrite: true,
                }
              ],
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
            },
            module: {
              rules: [
                {
                  test: /\.svg$/,
                  type: 'asset',
                },
                {
                  test: /\.(jsx?|tsx?)$/,
                  exclude: [/node_modules/, /src\/packages/],
                  use: [
                    {
                      loader: 'swc-loader',
                      options: {
                        sourceMap: true,
                        jsc: {
                          parser: {
                            syntax: 'typescript',
                            tsx: true,
                          },
                          transform: {
                            react: {
                              runtime: 'automatic',
                              development: isDev,
                              refresh: isDev,
                            },
                          },
                        },
                        env: {
                          targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
                        },
                      },
                    },
                  ],
                },
                {
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader'],
                },
              ],
            },
            plugins: [
              new HtmlWebpackPlugin({
                template: './index.html',
              }),
            ].filter(Boolean),
          };
        `
      );
    }
  }

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(MyCompilerPlugin);

  return container;
}
