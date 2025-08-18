import {
  LifeCycleHooksPlugin,
  ServiceMetaKind,
  GeneratorInfrastructureDomain,
  NASLDomain,
  CommonAppConfig
} from "@lcap/nasl-unified-frontend-generator";
import {
  type App,
  type Frontend,
  type FrontendType,
  type SyntaxNode,
  asserts,
} from '@lcap/nasl-concepts';
import { injectable, inject, Container } from "inversify";

const pluginCode = `class RemoveUnusedApisPlugin {
  constructor(options = {}) {
    this.options = {
      // 要处理的文件模式
      filePatterns: ['*.js'],
      // 是否启用调试模式
      debug: false,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'RemoveUnusedApisPlugin';

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // 遍历所有输出的资源
      Object.keys(compilation.assets).forEach(filename => {
        // 只处理匹配的文件
        if (this.shouldProcessFile(filename)) {
          const asset = compilation.assets[filename];
          let source = asset.source();

          // 删除指定的API声明
          let modified = false;
          this.options.patterns.forEach(pattern => {
            const originalLength = source.length;
            source = this.removeApiDeclarations(source, pattern);
            if (source.length !== originalLength) {
              modified = true;
            }
          });

          // 如果内容被修改，更新资源
          if (modified) {
            compilation.assets[filename] = {
              source: () => source,
              size: () => source.length
            };
            if (this.options.debug) {
              console.log(\`Modified \${filename}, new size: \${source.length} bytes\`);
            }
          }
        }
      });

      callback();
    });
  }

  shouldProcessFile(filename) {
    return this.options.filePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(filename);
    });
  }

  removeApiDeclarations(source, pattern) {
    let result = source;

    if (this.options.debug) {
      console.log(\`Matches \${pattern}\`)
    }
    result = result.replace(pattern, (m) => {
      if (this.options.debug) {
        console.log(\`Removed API: \${m}\`);
      }
      return \`''\`
    });

    // 清理可能产生的多余逗号和换行
    result = result.replace(/,(\s*,)+/g, ','); // 多个连续逗号
    result = result.replace(/,(\s*[}\]])/g, '$1'); // 对象或数组结尾前的逗号
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n'); // 多个空行

    return result;
  }
}

module.exports = RemoveUnusedApisPlugin;
`;

export function genInterfacesOnDemand(container: Container) {
  @injectable()
  class MyGenInterfacesOnDemandPlugin extends LifeCycleHooksPlugin implements NASLDomain.IRPreProcesser {
    private needDeleteInterfacePatterns: RegExp[] = []; // 需要被删除的接口对应的正则表达式
    private needDeleteEntityInterfaces: string[] = []; // 应用中没有用到的实体接口
    private usedExternalInterfaces: string[] = []; // 已经调用的外部接口

    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
    ) {
      super(fileSystemProvider);
    }

    preProcess(app: App, frontend: Frontend, config: CommonAppConfig) {
      /** 流程接口 */
      // 如果流程、流程依赖库都没有，则将相应的请求接口替换为空字符
      if (app.processV2s.length === 0 && !app.dependencies.find(item => item.name === "lcap_process_framework")) {
        this.needDeleteInterfacePatterns = this.needDeleteInterfacePatterns.concat([
          /['"]\/api\/system\/process\/([a-zA-Z0-9]+)['"]/g,
          /['"]\/api\/processV2\/([a-zA-Z0-9]+)['"]/g,
          /['"]\/api\/system\/processV2\/([a-zA-Z0-9]+)['"]/g,
        ]);
      }

      // 已经调用的实体方法
      const usedEntityInterfaces: string[] = [];
      app.frontendTypes.forEach((frontendType: FrontendType) => {
        frontendType.traverseStrictChildren((node: SyntaxNode) => {
          if (asserts.isCallLogic(node)) {
            if (node.calleeNamespace.startsWith('app.dataSources.')) {
              usedEntityInterfaces.push(`${node.calleeNamespace}${node.calleeName}`);
            }
          }

          if (asserts.isCallInterface(node)) {
            this.usedExternalInterfaces.push(`${node.calleeNamespace}${node.calleeName}`);
          }
        });
      });

      /** 实体接口 */
      // 生成所有实体方法
      const allEntityInterfaces: string[] = [];
      for (const dataSource of app.dataSources) {
        for (const entity of dataSource.entities) {
          const methods = ['get', 'create', 'update', 'delete', 'createOrUpdate', 'updateBy', 'deleteBy', 'batchCreate', 'batchUpdate', 'batchDelete', 'import'];
          methods.forEach(method => allEntityInterfaces.push(`app.dataSources.${dataSource.name}.entities.${entity.name}.logics.${method}`));
        }
      }

      // 获取到应用中没有用到的实体接口
      this.needDeleteEntityInterfaces = allEntityInterfaces.filter(i => !usedEntityInterfaces.includes(i));

      return { app, frontend, config };
    }

    async afterAllFilesGenerated() {
      /** 流程接口 */
      let vueConfigCode = this.fileSystemProvider.read("/vue.config.js")?.toString();
      vueConfigCode = `const RemoveUnusedApisPlugin = require('./webpack-plugins/remove-unused-apis');\n${vueConfigCode}`;
      const pluginInitCode = `
      config.plugins.push(new RemoveUnusedApisPlugin({
        debug: true,
        patterns: [
          ${this.needDeleteInterfacePatterns.join(',\n')}
        ],
      }));`;

      vueConfigCode.replace(/(configureWebpack\s*\(\s*config\s*\)\s*\{)(\s*\n)/, `$1$2  ${pluginInitCode}\n`);
      this.fileSystemProvider.write(
        "/vue.config.js",
        vueConfigCode
      );

      this.fileSystemProvider.write(
        "/webpack-plugins/remove-unused-apis.js",
        pluginCode
      );

      /** 实体接口 */
      // 将没有用到的实体方法文件写成空
      for (const item of this.needDeleteEntityInterfaces) {
        this.fileSystemProvider.write(
          `src/metaData/logicsMap/${item}.js`,
          ''
        );
      }

      /** 外部接口 */
      // 去除 /src/metaData/servicesMap/_custom.js 里未用到的外部接口替换成空
      let servicesMapCode = this.fileSystemProvider.read("/src/metaData/servicesMap/_custom.js")?.toString() || '';
      // 去掉 export default，得到对象字符串
      const objStr = servicesMapCode.replace(/export\s+default\s+/, '').trim();
      // 用 eval 或 Function 解析对象
      const obj = (new Function('return ' + objStr))();
      for (const key of Object.keys(obj)) {
        if (!this.usedExternalInterfaces.includes(key)) {
          // 删除没被前端调用的外部接口
          delete obj[key];
        }
      }
      // 重新写入到文件中
      const jsonStr = JSON.stringify(obj, null, 2);
      this.fileSystemProvider.write(
        "/src/metaData/servicesMap/_custom.js",
        `export default ${jsonStr}`
      );
    }
  }

  // 创建一个插件实例并直接绑定，确保使用同一个实例
  const pluginInstance = new MyGenInterfacesOnDemandPlugin(
    container.get(ServiceMetaKind.FileSystemProvider)
  );

  container.bind(ServiceMetaKind.IRPreProcesser).toConstantValue(pluginInstance);
  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .toConstantValue(pluginInstance);

  return container;
}
