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
import { Container } from "inversify";

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
  .to(FileSystemPlugin);
container
  .bind<JavaScriptDomain.FrontendApplicationDomain.MicroFrontendManager>(
    ServiceMetaKind.MicroFrontendManager
  )
  .to(MicroFrontendPlugin);

function changeProjectLayout() {
  const originalViewFolderMark = `/__views__/`;

  /**
   * 修改文件移动方法
   *
   * 可以直接修改插件原型上的方法来修改插件的行为
   */
  ProjectOrganizerPlugin.prototype.moveFilesAsYouWant = async function (
    placedFiles: PlacedFile[]
  ) {
    const logger = Logger("自定义移动");
    placedFiles.forEach((f) => {
      const to = f.getFolder().replace(originalViewFolderMark, "/pages/");
      f.moveFileTo(to);
      logger.info(
        `将 ${f.originalAbsolutePath} 移动到 ${f.currentAbsolutePath}`
      );
    });
  };
}

function setUpEslint() {
  const logger = Logger("自定义生命周期插件");
  class MyLifeCycleHooksPlugin extends LifeCycleHooksPlugin {
    afterAllFilesGenerated(): void {
      logger.info("afterAllFilesGenerated");
      const files = Object.keys(this.fileSystemProvider.toJSON());
      logger.info({ files });
    }
  }
  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(MyLifeCycleHooksPlugin);
}

changeProjectLayout();
setUpEslint();

// 在做完插件修改后，启动Demo的翻译
startDemoTranslation(container).catch((error) => {
  console.error(error);
});
