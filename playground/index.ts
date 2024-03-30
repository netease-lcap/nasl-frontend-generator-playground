import "@abraham/reflection";
import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { startDemoTranslation } from "@lcap/nasl-unified-frontend-generator/playground";
import { setUpEslint } from "./customization/custom-eslint";
import { setUpProjectLayout } from "./customization/custom-project-layout";

Promise.resolve()
  // 创建新的默认插件容器
  .then(makeDefaultContainer)
  // 自定义项目布局
  .then(setUpProjectLayout)
  // 新增eslint配置和脚本
  .then(setUpEslint)
  // 在做完插件修改后，使用此时的插件容器启动Demo的翻译
  .then(startDemoTranslation);
