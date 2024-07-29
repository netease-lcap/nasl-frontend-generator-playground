import {
  ServiceMetaKind,
  JavaScriptDomain,
} from "@lcap/nasl-unified-frontend-generator";
import { Container } from "inversify";

export function setupNpmPackages(container: Container) {
  const npmPackageJSONManagerPlugin =
    container.get<JavaScriptDomain.FrontendApplicationDomain.NpmPackageJSONManager>(
      ServiceMetaKind.NpmPackageJSONManager
    );

  npmPackageJSONManagerPlugin.patch({
    scripts: {
      lint: "eslint --fix",
    },
    devDependencies: {
      "redux-electron-store": "0.6.6",
    },
  });
  return container;
}
