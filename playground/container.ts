import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { setupAddConfigToWebpack } from './customization/custom-add-config';
import { Container } from "inversify";

async function getBuildTimes(container: Container) {
  let data = {};
  // try {
  //   const res = await fetch('https://dev-apitest-csforkf.lcap.codewave-test.163yun.com/rest/exportCount');
  //   data = await res.json();
  // } catch (e) {
  //   console.log(e);
  // }
  // TODO
  return {
    container,
    // extensions: data.result,
    extensions: {},
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
