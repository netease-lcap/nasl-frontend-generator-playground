const NASL_ZLIB_PATH = process.env.NASL_ZLIB_PATH;
if (!NASL_ZLIB_PATH) {
  throw new Error("NASL_ZLIB_PATH未设置");
}

const FRONTENDS = [
  {
    name: "pc",
    type: "pc",
    path: "/",
    selected: true,
    title: "PC端",
  },
  {
    name: "m",
    type: "h5",
    path: "/m",
    selected: false,
    title: "H5端",
  },
];

export const envs = {
  NASL_ZLIB_PATH,
  FRONTENDS,
  debuggerServerPort: 3001,
};
