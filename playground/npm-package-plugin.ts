import "@abraham/reflection";
import {
  GeneratorInfrastructureDomain,
  ServiceMetaKind,
} from "@lcap/nasl-unified-frontend-generator";
import { inject, injectable } from "inversify";
import { merge } from "lodash";
export type PackageJSON = Record<string, any>;

export const NpmPackageJSONPluginSymbol = Symbol.for("NpmPackageJSONPlugin");
@injectable()
export class NpmPackageJSONPlugin {
  constructor(
    @inject(ServiceMetaKind.FileSystemProvider)
    private fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider
  ) {}

  private packageJSONPath = "/package.json";

  private readPkg(): PackageJSON | undefined {
    try {
      const pkg = this.fileSystemProvider.read(this.packageJSONPath);
      if (pkg) {
        return JSON.parse(pkg);
      }
    } catch (error) {}
    return undefined;
  }

  private writePkg(pkg: PackageJSON) {
    this.fileSystemProvider.write(
      this.packageJSONPath,
      JSON.stringify(pkg, null, 2)
    );
  }

  patch(obj: {}) {
    const pkg = this.readPkg() ?? {};
    // recursively merge obj to pkg
    merge(pkg, obj);
    this.writePkg(pkg);
  }
}
