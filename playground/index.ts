import "@abraham/reflection";
import {
  FileSystemPlugin,
  Generator,
  GeneratorInfrastructureDomain,
  JavaScriptDomain,
  LifeCycleHooksPlugin,
  Logger,
  MicroFrontendPlugin,
  NASLAppIRBuilderPlugin,
  NASLDomain,
  PlacedFile,
  ProjectOrganizerPlugin,
  ReactPresetPlugin,
  ServiceMetaKind,
} from "@lcap/nasl-unified-frontend-generator";
import { startDemoTranslation } from "@lcap/nasl-unified-frontend-generator/playground";
import dedent from "dedent";
import { Container, inject, injectable } from "inversify";
import {
  NpmPackageJSONPlugin,
  NpmPackageJSONPluginSymbol,
} from "./npm-package-plugin";

/**
 * 默认容器
 */
const container = new Container();
container
  .bind<Generator.NASLTranspiler>(ServiceMetaKind.NASLTranspiler)
  .to(ReactPresetPlugin);
container
  .bind<NASLDomain.IRBuilder>(ServiceMetaKind.IRBuilder)
  .to(NASLAppIRBuilderPlugin);
container
  .bind<GeneratorInfrastructureDomain.FileSystemProvider>(
    ServiceMetaKind.FileSystemProvider
  )
  .to(FileSystemPlugin)
  .inSingletonScope();
container
  .bind<JavaScriptDomain.FrontendApplicationDomain.MicroFrontendManager>(
    ServiceMetaKind.MicroFrontendManager
  )
  .to(MicroFrontendPlugin);

function changeProjectLayout() {
  const old = ProjectOrganizerPlugin.prototype.moveFilesAsYouWant;
  /**
   * 修改文件移动方法
   *
   * 可以直接修改插件原型上的方法来修改插件的行为
   */
  ProjectOrganizerPlugin.prototype.moveFilesAsYouWant = async function (
    placedFiles: PlacedFile[]
  ) {
    // 调用默认的移动逻辑
    old.call(this, placedFiles);
    const logger = Logger("自定义移动");
    placedFiles.forEach((f) => {
      const oldPath = f.currentAbsolutePath;
      const to = f.getFolder().replace("/src/pages/", "/src/views/");
      f.moveFileTo(to);
      logger.info(`将 ${oldPath} 移动到 ${f.currentAbsolutePath}`);
    });
  };
}

function setUpEslint() {
  @injectable()
  class MyEslintPlugin extends LifeCycleHooksPlugin {
    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
      @inject(NpmPackageJSONPluginSymbol)
      private npmPackageJSONPlugin: NpmPackageJSONPlugin
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
      this.npmPackageJSONPlugin.patch({
        devDependencies: {
          eslint: "8.57.0",
          typescript: "5.4.3",
          "typescript-eslint": "7.4.0",
        },
      });
      logger.info("在package.json中添加eslint启动脚本");
      this.npmPackageJSONPlugin.patch({
        scripts: {
          lint: "pnpm eslint --fix",
        },
      });
      const res = this.fileSystemProvider.read("/package.json");
      logger.info(res, "package.json内容");
    }
  }

  container
    .bind<NpmPackageJSONPlugin>(NpmPackageJSONPluginSymbol)
    .to(NpmPackageJSONPlugin);

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(MyEslintPlugin);
}

changeProjectLayout();
setUpEslint();

// 在做完插件修改后，启动Demo的翻译
startDemoTranslation(container).catch((error) => {
  console.error(error);
});
