const annotatedNASLPath =
  "/home/project/nasl-frontend-generator-playground/playground/fixtures/02195780-b1da-450b-a95e-d93147f02d7c/annotation-zlib";

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
  annotatedNASLPath,
  FRONTENDS,
  debuggerServerPort: 3001,
};
