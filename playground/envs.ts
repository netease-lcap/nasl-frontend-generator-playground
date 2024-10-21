import "dotenv/config";
import { join } from "node:path";
import { type GeneratorConfig } from "./types";

const NASL_ZLIB_PATH = process.env.NASL_ZLIB_PATH;
if (!NASL_ZLIB_PATH) {
  throw new Error("NASL_ZLIB_PATH未设置");
}

const tenantName = process.env.TENANT_NAME;

if(!tenantName){
  throw new Error(`TENANT_NAME未设置`);
}

type FrontendOption = {
  name: string;
  type: "pc" | "h5";
  path: string;
  selected: boolean;
  title: string;
};

const frontendOptionsStr = process.env.FRONTENDS;

if (!frontendOptionsStr) {
  throw new Error("FRONTENDS未设置");
}

const frontendOptions: FrontendOption[] = JSON.parse(frontendOptionsStr);


const generatorConfigStr = process.env.generatorConfig;
if(!generatorConfigStr){
  throw new Error("generatorConfig未设置");
}
const generatorConfig: GeneratorConfig = JSON.parse(generatorConfigStr);

export const envs = {
  naslZlibObjectPath: NASL_ZLIB_PATH,
  frontendOptions,
  debuggerServerPort: 3001,
  playgroundRoot: __dirname,
  outputFolder: process.env.OUTPUT_FOLDER || join(__dirname, "..", "./out"),
  TENANT_NAME: tenantName,
  generatorConfig,
  legacyClientPath: process.env.LEGACY_CLIENT_PATH ?? null,
};
