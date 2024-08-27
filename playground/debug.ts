import "dotenv/config";
import { Logger } from "@lcap/nasl-unified-frontend-generator";
import { writeCode } from "./utils";
import { translate } from "./translate";
import { envs } from "./envs";

// HACK: 允许证书有问题的HTTPs请求
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
