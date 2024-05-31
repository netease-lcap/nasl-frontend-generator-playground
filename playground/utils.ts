import { App } from "@lcap/nasl";
import {
  Logger,
  deserializeAppWhileKeepTypeAnnotation,
} from "@lcap/nasl-unified-frontend-generator";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

import { unzip } from "node:zlib";
import { envs } from "./envs";
import { MaterialData } from "@lcap/nasl/out/generator/release-body/internal";
import { assert } from "node:console";
import url from  'url';

const do_unzip = promisify(unzip);

export type DiffNodePath = string[];

type NaslRawCompilerObject = {
  isFull?: boolean;
  updatedModules?: DiffNodePath[];
  annotatedNasl: object;
};

type NaslCompilerObject = {
  isFull: boolean;
  updatedModules: DiffNodePath[];
  app: App;
};

async function readNASLZLibObject(path: string): Promise<NaslRawCompilerObject>{
  const buffer = await readFile(path);
  const jsonStr = await do_unzip(buffer).then((buf) => buf.toString());
  return JSON.parse(jsonStr);
}

export async function loadNaslCompilerObject(): Promise<NaslCompilerObject> {
  const {annotatedNasl, isFull, updatedModules} = await readNASLZLibObject(envs.NASL_ZLIB_PATH); // Fixed the function name
  const app = deserializeAppWhileKeepTypeAnnotation(annotatedNasl);
  return { app, isFull: !!isFull, updatedModules: updatedModules ?? [] };
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


const logger = Logger('utils');

/**
 * @deprecated 这些逻辑要放到NASL里面去
 */
export const tempUtils = {
  async getAndLoadPackageInfos(
    app: App,
    options: { staticUrl: string; fullVersion: string }
  ) {
    const l = logger.child({ prefix: "haha" });
    const { staticUrl, fullVersion } = options;
    const resolvedUrl = url.resolve("http:", staticUrl);
    try {
      const materialConfigCode = await fetch(
        `${resolvedUrl}/packages/@lcap/mdd-ide@${fullVersion}/dist-mdd-ide/material.config.js`
      ).then((res) => res.text());
      assert(
        typeof materialConfigCode === "string",
        "materialCode should be string"
      );
      l.debug({ materialConfigCode });
      const window = {} as { LCAP_MATERIALS: MaterialData };
      eval(materialConfigCode);
      // TODO wudengke 确认NASL中的这个函数使用的是globalThis而不是window
      return app.loadPackageInfos(window.LCAP_MATERIALS);
    } catch (error) {
      l.error("加载materialConfig失败");
      l.error(error);
      throw new Error("eval material code 失败");
    }
  },
};