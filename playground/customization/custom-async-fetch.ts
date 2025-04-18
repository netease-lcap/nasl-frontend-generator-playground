import {
  LifeCycleHooksPlugin,
  ServiceMetaKind,
  GeneratorInfrastructureDomain,
  NASLDomain,
  CommonAppConfig
} from "@lcap/nasl-unified-frontend-generator";
import type { App, Frontend } from '@lcap/nasl-concepts';
import dedent from "dedent";
import { injectable, inject, Container } from "inversify";

export function asyncFetchData(container: Container) {
  @injectable()
  class MyCompilerPlugin extends LifeCycleHooksPlugin implements NASLDomain.IRPreProcesser {
    private appId: string;

    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
    ) {
      super(fileSystemProvider);
      this.appId = '';
    }

    preProcess(app: App, frontend: Frontend, config: CommonAppConfig) {
      this.appId = app.id;
      return { app, frontend, config };
    }

    async afterAllFilesGenerated() {
      const data = await fetch('https://frodo.douban.com/api/v1/book/rank_list?apiKey=054022eaeae0b00e0fc068c0c0a2102a').then(res => res.json());
      this.fileSystemProvider.write(
        "/data.js",
        dedent`
          ${this.appId}
          ${data?.msg}
          `
      );
    }
  }

  // 创建一个插件实例并直接绑定，确保使用同一个实例
  const pluginInstance = new MyCompilerPlugin(
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
