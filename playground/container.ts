import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { setupAddConfigToWebpack } from './customization/custom-add-config';
import { Container } from "inversify";

async function getBuildTimes(container: Container) {
  const res = await fetch('http://defaulttenant.lcap.codewave-dev.163yun.com/api/v1/env/config');
  const data = await res.json();
  return {
    container,
    extensions: data.result,
  };
}


// 样例：修改默认容器中的内容。替换makeContainer为如下代码
// import { setupPerformanceOptions } from "./customization/custom-performance";
// import { setupNpmPackages } from "./customization/custom-npm-package";
// import { setupCompilerToWebpack } from "./customization/custom-compiler";
// import { setupMicrofrontend } from "./customization/custom-microfrontend";
// export async function makeContainer() {
//   const container = makeDefaultContainer(); // 构造默认容器
//   return Promise.resolve(container)
//     .then(setupPerformanceOptions) // 修改性能配置
//     .then(setupNpmPackages) // 修改npm包
//     .then(setupCompilerToWebpack) // 修改前端编译器为Webpack
//     .then(setupMicrofrontend); // 修改微前端配置
// }

export async function makeContainer() {
  const container = makeDefaultContainer(); // 构造默认容器
  // return Promise.resolve(container);
  return Promise.resolve(container).then(getBuildTimes).then(setupAddConfigToWebpack);
}
