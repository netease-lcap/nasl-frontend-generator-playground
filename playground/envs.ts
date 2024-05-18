const NASL_ZLIB_PATH = process.env.NASL_ZLIB_PATH;
if (!NASL_ZLIB_PATH) {
  throw new Error("NASL_ZLIB_PATH未设置");
}

type FrontendOption = {
  name: string;
  type: string;
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
  NASL_ZLIB_PATH,
  frontendOptions,
  debuggerServerPort: 3001,
};
