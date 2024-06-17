import "dotenv/config";
import { join } from "node:path";

const NASL_ZLIB_PATH = process.env.NASL_ZLIB_PATH;
if (!NASL_ZLIB_PATH) {
  throw new Error("NASL_ZLIB_PATH未设置");
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

export const envs = {
  naslZlibObjectPath: NASL_ZLIB_PATH,
  frontendOptions,
  debuggerServerPort: 3001,
  playgroundRoot: __dirname,
  outputFolder: process.env.OUTPUT_FOLDER || join(__dirname, "..", "./out"),
  TENANT_NAME: process.env.TENANT_NAME,
};
