import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { setupPerformanceOptions } from "./customization/custom-performance";
import { setupNpmPackages } from "./customization/custom-npm-package";
import { setupCompilerToWebpack } from "./customization/custom-compiler";
import { setupMicrofrontend } from "./customization/custom-microfrontend";

export async function makeContainer() {
  const container = makeDefaultContainer(); // 构造默认容器
  return Promise.resolve(container)
    .then(setupPerformanceOptions) // 修改性能配置
    .then(setupNpmPackages) // 修改npm包
    .then(setupCompilerToWebpack) // 修改前端编译器为Webpack
    .then(setupMicrofrontend); // 修改微前端配置
}
