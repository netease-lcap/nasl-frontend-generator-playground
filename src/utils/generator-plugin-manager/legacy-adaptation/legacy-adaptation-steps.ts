import type { NASLFrontendGeneratorContainer } from "../types";

/**
 * 前端代码翻译器插件适配器
 */
export namespace GeneratorPluginAdaptor {
  /**
   * 遗留通路的文件系统适配相关
   */
  export namespace LegacyAdaption {
    /**
     * 将文件复制到翻译器的内存文件系统
     */
    export interface StepCopyFilesToGeneratorFS {
      /**
       * 复制文件到翻译器
       * @param sourceCodeDir - 源代码路径
       * @returns 执行代码生成生命周期钩子
       */
      copyFilesToGeneratorFS: ({
        sourceCodeDir,
        container,
      }: {
        sourceCodeDir: string;
        container: NASLFrontendGeneratorContainer;
      }) => Promise<StepRunCodeGenerationLifecycleHooks>;
    }

    /**
     * 执行代码生成生命周期钩子
     */
    export interface StepRunCodeGenerationLifecycleHooks {
      /**
       * 执行代码生成生命周期钩子
       * @returns 将文件系统保存到临时目录
       */
      runCodeGenerationLifecycleHooks: () => Promise<StepSaveFileSystemToTempDir>;
    }

    /**
     * 将文件系统保存到临时目录
     */
    export interface StepSaveFileSystemToTempDir {
      /**
       * 将文件系统保存到临时目录
       * @param tempDir 临时目录
       * @returns 将临时目录移动到源代码文件夹
       */
      saveFileSystemToTempDir: (
        tempDir: string
      ) => Promise<void>;
    }


    /**
     * 遗留通路的文件系统适配步骤
     */
    export interface Steps
      extends StepCopyFilesToGeneratorFS,
        StepRunCodeGenerationLifecycleHooks,
        StepSaveFileSystemToTempDir         {}
  }
}
