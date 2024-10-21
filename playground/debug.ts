import { Logger } from "@lcap/nasl-unified-frontend-generator";
import "dotenv/config";
import { envs } from "./envs";
import { debugLegacy } from "./legacy";
import { translate } from "./translate";
import { writeCode } from "./utils";

// HACK: 允许证书有问题的HTTPs请求
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (envs.legacyClientPath) {
  const logger = Logger("Vue应用源码插件");
  logger.info(`检测到legacyClientPath: ${envs.legacyClientPath}`);
  debugLegacy({
    clientPath: envs.legacyClientPath,
    outputPath: envs.outputFolder,
  }).then(() => {
    logger.info("Vue应用源码插件结束");
  });
} else {
  const logger = Logger("翻译");
  logger.info("开始翻译");

  translate(envs.generatorConfig)
    .then(async (files) => {
      logger.info(
        files.map((x) => x.path),
        "写入文件"
      );
      await writeCode(files);
    })
    .then(() => {
      logger.info("翻译结束");
      process.exit(0);
    });
}
