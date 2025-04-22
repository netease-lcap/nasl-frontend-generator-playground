import { Logger } from "@lcap/nasl-unified-frontend-generator";
import "dotenv/config";
import { envs } from "./envs";
import { debugLegacy } from "./legacy";
import { translate } from "./translate";
import { writeCode } from "./utils";
import { existsSync } from "fs-extra";

// HACK: 允许证书有问题的HTTPs请求
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

Promise.resolve()
  .then(() => {
    // 传入此路径，并且所指的文件夹存在, 则认为是调试Vue应用的源码插件
    const logger = Logger("Vue应用源码插件");
    if (envs.legacyClientPath) {
      logger.info(`检测到legacyClientPath: ${envs.legacyClientPath}`);
      if (existsSync(envs.legacyClientPath)) {
        logger.info(`开始应用插件`);
        return debugLegacy({
          clientPath: envs.legacyClientPath,
          outputPath: envs.outputFolder,
        })
          .then(() => {
            logger.info(`处理完成，已输出到: ${envs.outputFolder}`);
          })
          .then(() => {
            return true;
          });
      } else {
        logger.info(`legacyClientPath不存在`);
      }
    }
  })
  .then((skip) => {
    if (skip) {
      return;
    }
    const logger = Logger("翻译");
    logger.info("开始翻译");

    return translate(envs.generatorConfig)
      .then(async (files) => {
        logger.info(
          files.map((x) => x.path),
          "写入文件"
        );
        await writeCode(files);
      })
      .then(() => {
        logger.info("翻译结束");
      });
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    process.exit(0);
  });
