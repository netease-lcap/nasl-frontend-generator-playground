import { App } from "@lcap/nasl";
import {
  Logger,
  deserializeAppWhileKeepTypeAnnotation,
} from "@lcap/nasl-unified-frontend-generator";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

import { unzip } from "node:zlib";
import { envs } from "./envs";
const do_unzip = promisify(unzip);
export async function readNASLApp(): Promise<App> {
  const buffer = await readFile(envs.annotatedNASLPath);
  const json = await do_unzip(buffer).then((buf) => buf.toString());
  const obj = JSON.parse(json);
  return deserializeAppWhileKeepTypeAnnotation(obj);
}

export async function writeCode(codeList: { content: string; path: string }[]) {
  const debugServerHost = `http://localhost:${envs.debuggerServerPort}`;
  const logger = Logger("代码写入");
  logger.info("开始写入debug用文件系统");
  for (const { content, path } of codeList) {
    logger.trace({ path }, `写入`);
    await fetch(`${debugServerHost}/compile`, {
      method: "POST",
      body: JSON.stringify({ path, content }),
      headers: {
        "content-type": "application/json",
      },
    });
    logger.trace({ path }, `写入完成`);
  }
  logger.info("全部写入完成");
}
