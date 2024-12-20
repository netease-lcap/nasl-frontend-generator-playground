import {
  LifeCycleHooksPlugin,
  ServiceMetaKind,
  GeneratorInfrastructureDomain,
  Logger,
  JavaScriptDomain,
} from "@lcap/nasl-unified-frontend-generator";
import dedent from "dedent";
import { injectable, inject, Container } from "inversify";

export function setupEslint(container: Container) {
  @injectable()
  class MyEslintPlugin extends LifeCycleHooksPlugin {
    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
      @inject(ServiceMetaKind.NpmPackageJSONManager)
      private npmPackageJSONManagerPlugin: JavaScriptDomain.FrontendApplicationDomain.NpmPackageJSONManager
    ) {
      super(fileSystemProvider);
    }
    afterAllFilesGenerated(): void {
      const logger = Logger("自定义Lint插件");

      logger.info("写入eslint配置");
      this.fileSystemProvider.write(
        "/eslint.config.mjs",
        dedent`
          // @ts-check
          import eslint from '@eslint/js';
          import tseslint from 'typescript-eslint';

          export default tseslint.config(
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
          );
          `
      );
      this.fileSystemProvider.write(
        "/.eslintignore",
        dedent`
          src/packages/**/*.js
        `
      );
      logger.info("在package.json中添加依赖");
      this.npmPackageJSONManagerPlugin.patch({
        devDependencies: {
          eslint: "8.57.0",
          typescript: "5.4.3",
          "typescript-eslint": "7.4.0",
        },
      });
      logger.info("在package.json中添加eslint启动脚本");
      this.npmPackageJSONManagerPlugin.patch({
        scripts: {
          lint: "pnpm eslint --fix",
        },
      });
      const res = this.fileSystemProvider.read("/package.json");
      logger.info(res?.toString(), "package.json内容");
    }
  }

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(MyEslintPlugin);

  return container;
}
