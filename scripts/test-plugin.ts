import { Container } from "inversify";
// @ts-expect-error
import { makeContainer } from "../dist/plugin";
console.log("开始测试插件");
makeContainer().then((c: Container) => {
  console.log("测试成功");
});
