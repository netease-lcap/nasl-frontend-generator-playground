import { Container } from "inversify";
import {
  ServiceMetaKind,
  type AnalyzerManager,
  AnalyzerManagerPlugin,
} from "@lcap/nasl-unified-frontend-generator";

/**
 * 对 Vue 2 项目启用异步分析，可以消除不必要的 async / await
 */
export function setupAsyncAnalysis(c: Container) {
  if (!c.isBound(ServiceMetaKind.AnalyzerManager)) {
    c.bind(ServiceMetaKind.IRPreProcesser)
      .to(AnalyzerManagerPlugin)
      .inSingletonScope();
  }
  const manager = c
    .getAll<AnalyzerManager>(ServiceMetaKind.IRPreProcesser)
    .find((x) => x instanceof AnalyzerManagerPlugin);
  manager?.setOptions({ asyncAnalysis: true }); // 启用异步分析器
  if (manager) {
    console.log("启用了异步分析插件");
  } else {
    console.log("未找到分析管理器，未启用异步分析插件");
  }
  return c;
}
