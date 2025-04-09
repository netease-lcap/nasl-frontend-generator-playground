import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { GeneratorPluginLegacyAdaptor } from "../src/utils/generator-plugin-manager/legacy-adaptation/generator-plugin-adaptor";
import { applyCustomization } from "./container";
// import { makeContainer } from "./container";

export async function debugLegacy({
  clientPath,
  outputPath,
}: {
  clientPath: string;
  outputPath: string;
}) {
  let container = makeDefaultContainer();

  // 兼容旧版插件
  // 旧版插件会提供一个用于生成 container 的方法
  // if (makeContainer) {
  //   container = await makeContainer();
  // }

  // 新版插件
  // 新版插件会提供一个 applyCustomization 方法，用于执行自定义逻辑，接收一个 container，返回一个 container
  if (applyCustomization) {
    container = await applyCustomization(container);
  }
  return GeneratorPluginLegacyAdaptor.create({
    clientPath,
    container,
    outputPath,
  }).execute();
}
