import {
  GeneratorInfrastructureDomain,
  ServiceMetaKind,
} from "@lcap/nasl-unified-frontend-generator";
import fs from "fs-extra";
import { glob } from "glob";
import path from "path";
import { NASLFrontendGeneratorContainer } from "../types";
import { GeneratorPluginAdaptor } from "./legacy-adaptation-steps";
const { isText } = require('istextorbinary');
import Adaption = GeneratorPluginAdaptor.LegacyAdaption;

function outputFileFromJSONSync(
  fileDict: Record<string, string | Buffer | null>,
  folder: string
) {
  Object.keys(fileDict).forEach((k) => {
    if (!k.startsWith("/")) {
      throw new Error("文件路径必须以/开头");
    }
    const filePath = path.join(folder, k);
    const val = fileDict[k];
    if (val === null) {
      fs.removeSync(filePath);
    } else {
      fs.outputFileSync(filePath, val);
    }
  });
}

/**
 * 前端翻译器插件的遗留通路适配器
 *
 * Vue应用的代码生成属于遗留通路，没有接入统一前端翻译器。
 *
 * 为了适配统一前端翻译器的插件系统，暂时需要一个适配器负责读写代码，让插件系统处理后再写回。
 * 执行流程参考: {@link GeneratorPluginLegacyAdaptor#execute}
 */
export class GeneratorPluginLegacyAdaptor implements Adaption.Steps {
  private constructor(options: {
    container: NASLFrontendGeneratorContainer;
    clientPath: string;
    outputPath: string;
  }) {
    this.container = options.container;
    this.sourceCodeDir = options.clientPath;
    this.outputPath = options.outputPath;
  }

  static create(options: {
    container: NASLFrontendGeneratorContainer;
    clientPath: string;
    outputPath: string;
  }): Pick<GeneratorPluginLegacyAdaptor, "execute"> {
    return new GeneratorPluginLegacyAdaptor(options);
  }

  private container: NASLFrontendGeneratorContainer;
  private sourceCodeDir: string;
  private outputPath: string;

  async execute() {
    const tempDir = path.join(this.outputPath);
    return Promise.resolve(this)
      .then((step) =>
        step.copyFilesToGeneratorFS({
          sourceCodeDir: step.sourceCodeDir,
          container: step.container,
        })
      )
      .then((step) => step.runCodeGenerationLifecycleHooks())
      .then((step) => step.saveFileSystemToTempDir(tempDir));
  }

  async copyFilesToGeneratorFS({
    sourceCodeDir,
    container,
  }: {
    sourceCodeDir: string;
    container: NASLFrontendGeneratorContainer;
  }): Promise<Adaption.StepRunCodeGenerationLifecycleHooks> {
    const fileSystem =
      container.get<GeneratorInfrastructureDomain.FileSystemProvider>(
        ServiceMetaKind.FileSystemProvider
      );
    for await (const p of glob.iterate("**/*", {
      cwd: this.sourceCodeDir,
      root: "./",
      nodir: true,
    })) {
      const realPath = path.join(sourceCodeDir, p);
      const pWithStartingSlash = `/${p}`;
      if (isText(realPath)) {
        fileSystem.write(pWithStartingSlash, fs.readFileSync(realPath).toString('utf-8'));
      } else {
          // @ts-ignore 3.11.x的文件系统在类型上不支持写入Buffer
          fileSystem.write(pWithStartingSlash, fs.readFileSync(realPath));
      }
    }
    return this;
  }

  async runCodeGenerationLifecycleHooks(): Promise<Adaption.StepSaveFileSystemToTempDir> {
    if (this.container.isBound(ServiceMetaKind.CodeGenerationLifecycleHooks)) {
      const hooks = this.container
        .getAll<GeneratorInfrastructureDomain.CodeGenerationLifecycleHooks>(
          ServiceMetaKind.CodeGenerationLifecycleHooks
        );

      for (const h of hooks) {
        await h.afterAllFilesGenerated();
      }
    }
    return this;
  }

  async saveFileSystemToTempDir(tempDir: string): Promise<void> {
    outputFileFromJSONSync(
      this.container
        .get<GeneratorInfrastructureDomain.FileSystemProvider>(
          ServiceMetaKind.FileSystemProvider
        )
        .toJSON(),
      tempDir
    );
  }

  async moveTempDirToSourceCodeDir(tempDir: string) {
    await fs.move(tempDir, this.sourceCodeDir, { overwrite: true });
  }
}
