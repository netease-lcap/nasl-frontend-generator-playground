import {
  IRBuilder,
  MicroFrontendManager,
  MicroFrontendPlugin,
  NASLAppIRBuilderPlugin,
  NASLTranspiler,
  PlacedFile,
  ProjectOrganizerPlugin,
  ReactPresetPlugin,
  ServiceMetaKind,
  Logger,
} from "@lcap/nasl-unified-frontend-generator";
import { startDemoTranslation } from "@lcap/nasl-unified-frontend-generator/dist/playground";
import { Container } from "inversify";

/**
 * 默认容器
 */
const container = new Container();
container
  .bind<NASLTranspiler>(ServiceMetaKind.NASLTranspiler)
  .to(ReactPresetPlugin);
container.bind<IRBuilder>(ServiceMetaKind.IRBuilder).to(NASLAppIRBuilderPlugin);
container
  .bind<MicroFrontendManager>(ServiceMetaKind.MicroFrontendManager)
  .to(MicroFrontendPlugin);

/**
 * 修改文件移动方法
 */
ProjectOrganizerPlugin.prototype.moveFilesAsYouWant = async function (placedFiles: PlacedFile[]) {
  const logger = Logger('moveFilesAsYouWant');
  for (const f of placedFiles) {
    const originalViewFolderMark = `/__views__/`;
    if (f.originalAbsolutePath.includes(originalViewFolderMark)) {
      const to = f.getFolder().replace(originalViewFolderMark, '/views/');
      logger.info(`move ${f.originalAbsolutePath} from ${f.getFolder()} to ${to}`);
      f.moveFileTo(to);
    }
  }
}

// 在做完插件修改后，启动Demo的翻译
startDemoTranslation(container).catch((error) => {
  console.error(error);
});
