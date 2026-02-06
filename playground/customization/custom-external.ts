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
} from '@lcap/nasl-concepts';
import { injectable, inject, Container } from "inversify";


export function customizeExternal(container: Container) {
  @injectable()
  class MyCustomizeExternalPlugin extends LifeCycleHooksPlugin implements NASLDomain.IRPreProcesser {
    private appId: string = ''; // 应用id

    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
    ) {
      super(fileSystemProvider);
    }

    preProcess(app: App, frontend: Frontend, config: CommonAppConfig) {
      this.appId = app.id;
      console.log(`Pre-processing app ${app.id} with frontend ${frontend.name}`);
      return { app, frontend, config };
    }

    async afterAllFilesGenerated() {
     // 添加 externals 配置
      let vueConfigCode = this.fileSystemProvider.read("/vue.config.js");
      if (vueConfigCode) {
        vueConfigCode = vueConfigCode.toString();

        // 添加 externals 配置到 configureWebpack 中
        // TODO：添加实际需要剔除的依赖名和全局变量名映射
        const externalConfig = `
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter'
    };`;

        // 添加 externals 配置
        vueConfigCode = vueConfigCode.replace(
          /configureWebpack\(config\)\s*\{/,
          (match) => match + externalConfig
        );

        this.fileSystemProvider.write(
          "/vue.config.js",
          vueConfigCode
        );
      }

      // 如果是主应用，可以在 html 中插入 external 对应的 script 标签
      // TODO：修改 main 为实际主应用的 id
      if (this.appId === 'main') {
        let indexHtmlCode = this.fileSystemProvider.read("/public/index.html");
        if (indexHtmlCode) {
          indexHtmlCode = indexHtmlCode.toString();

          // TODO：添加实际需要剔除的依赖的资源文件链接
          const externalScripts = `
      <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vue-router@3/dist/vue-router.js"></script>`;

          // 在 </head> 前插入 external 脚本标签
          indexHtmlCode = indexHtmlCode.replace(
            /<\/head>/,
            (match) => externalScripts + "\n" + match
          );

          this.fileSystemProvider.write(
            "/public/index.html",
            indexHtmlCode
          );
        }
      }
    }
  }

  // 创建一个插件实例并直接绑定，确保使用同一个实例
  const pluginInstance = new MyCustomizeExternalPlugin(
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
