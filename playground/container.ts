import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { setupPerformanceOptions } from "./customization/customize-performance";
import { setupNpmPackages } from "./customization/custom-npm-package";
import { setupCompilerToWebpack } from "./customization/custom-compiler";

export async function makeContainer() {
  const container = makeDefaultContainer();
  return Promise.resolve(container)
    .then(setupPerformanceOptions)
    .then(setupNpmPackages)
    .then(setupCompilerToWebpack);
}
