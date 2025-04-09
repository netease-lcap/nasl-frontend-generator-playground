import { Container } from "inversify";
import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
// @ts-expect-error
import { makeContainer, applyCustomization } from "../dist/plugin";
console.log("开始测试插件");

if (makeContainer && applyCustomization) {
  throw new Error("测试失败: applyCustomization 和 makeContainer 不能同时存在");
}

// 兼容旧版插件
// 旧版插件会提供一个用于生成 container 的方法
if (makeContainer) {
  makeContainer().then((c: Container) => {
    console.log("测试成功");
  });
}

// 新版插件
// 新版插件会提供一个 applyCustomization 方法，用于执行自定义逻辑，接收一个 container，返回一个 container
if (applyCustomization) {
  const container = makeDefaultContainer();
  applyCustomization(container).then((c: Container) => {
    console.log("测试成功");
  });
}
