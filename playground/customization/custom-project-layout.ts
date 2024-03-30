import {
  ProjectOrganizerPlugin,
  PlacedFile,
  Logger,
} from "@lcap/nasl-unified-frontend-generator";
import { Container } from "inversify";

export function setUpProjectLayout(container: Container) {
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
  return container;
}
