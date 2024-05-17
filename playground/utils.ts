import { App } from "@lcap/nasl";
import { deserializeAppWhileKeepTypeAnnotation } from "@lcap/nasl-unified-frontend-generator";
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
