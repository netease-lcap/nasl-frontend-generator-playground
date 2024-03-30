import "@abraham/reflection";
import {
  FileSystemPlugin,
  Generator,
  GeneratorInfrastructureDomain,
  JavaScriptDomain,
  LifeCycleHooksPlugin,
  Logger,
  MicroFrontendPlugin,
  NASLAppIRBuilderPlugin,
  NASLDomain,
  PlacedFile,
  ProjectOrganizerPlugin,
  ReactPresetPlugin,
  ServiceMetaKind,
} from "@lcap/nasl-unified-frontend-generator";
import { startDemoTranslation } from "@lcap/nasl-unified-frontend-generator/playground";
import dedent from "dedent";
import { Container, injectable, inject } from "inversify";
import { merge } from "lodash";

/**
 * 默认容器
 */
const container = new Container();
container
  .bind<Generator.NASLTranspiler>(ServiceMetaKind.NASLTranspiler)
  .to(ReactPresetPlugin);
container
  .bind<NASLDomain.IRBuilder>(ServiceMetaKind.IRBuilder)
  .to(NASLAppIRBuilderPlugin);
container
  .bind<GeneratorInfrastructureDomain.FileSystemProvider>(
    ServiceMetaKind.FileSystemProvider
  )
  .to(FileSystemPlugin)
  .inSingletonScope();
container
  .bind<JavaScriptDomain.FrontendApplicationDomain.MicroFrontendManager>(
    ServiceMetaKind.MicroFrontendManager
  )
  .to(MicroFrontendPlugin);

function changeProjectLayout() {
  const originalViewFolderMark = `/__views__/`;

  /**
   * 修改文件移动方法
   *
   * 可以直接修改插件原型上的方法来修改插件的行为
   */
  ProjectOrganizerPlugin.prototype.moveFilesAsYouWant = async function (
    placedFiles: PlacedFile[]
  ) {
    const logger = Logger("自定义移动");
    placedFiles.forEach((f) => {
      const to = f.getFolder().replace(originalViewFolderMark, "/pages/");
      f.moveFileTo(to);
      logger.info(
        `将 ${f.originalAbsolutePath} 移动到 ${f.currentAbsolutePath}`
      );
    });
  };
}

type PackageJSON = Record<string, any>;

const NpmPackageJSONPluginSymbol = Symbol.for("NpmPackageJSONPlugin");
@injectable()
class NpmPackageJSONPlugin {
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
    this.fileSystemProvider.write(this.packageJSONPath, JSON.stringify(pkg));
  }

  patch(obj: {}) {
    const pkg = this.readPkg() ?? {};
    // recursively merge obj to pkg
    merge(pkg, obj);
    this.writePkg(pkg);
  }
}

function setUpEslint() {
  @injectable()
  class MyEslintPlugin extends LifeCycleHooksPlugin {
    constructor(
      @inject(ServiceMetaKind.FileSystemProvider)
      protected fileSystemProvider: GeneratorInfrastructureDomain.FileSystemProvider,
      @inject(NpmPackageJSONPluginSymbol)
      private npmPackageJSONPlugin: NpmPackageJSONPlugin
    ) {
      super(fileSystemProvider);
    }
    afterAllFilesGenerated(): void {
      const logger = Logger("自定义生命周期插件");
      // 写入eslint相关配置
      this.fileSystemProvider.write(
        "/eslint.config.js",
        dedent`
          module.exports  = {
            "extends": ["eslint:recommended", "plugin:react/recommended"]
          }
          `
      );
      this.npmPackageJSONPlugin.patch({
        devDependencies: {
          eslint: "^7.32.0",
          "eslint-plugin-react": "^7.26.1",
        },
      });
      const res = this.fileSystemProvider.read("/package.json");
      logger.info(res, "package.json内容");
    }
  }

  container
    .bind<NpmPackageJSONPlugin>(NpmPackageJSONPluginSymbol)
    .to(NpmPackageJSONPlugin);

  container
    .bind<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
      ServiceMetaKind.CodeGenerationLifecycleHooks
    )
    .to(MyEslintPlugin);
}

changeProjectLayout();
setUpEslint();

// 在做完插件修改后，启动Demo的翻译
startDemoTranslation(container).catch((error) => {
  console.error(error);
});
