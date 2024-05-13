import { App, Frontend } from "@lcap/nasl";

async function compile() {
  // TODO read NASL from /workspace/src.json
  const app = new App();
  // TODO read FRONTENDS from env
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
      selected: true,
      title: "H5端",
    },
  ];

  for (const frontend of FRONTENDS) {
    const path = `app.frontendTypes.${frontend.type}.${frontend.name}`;
    const f = app.findNodeByCompleteName(path) as Frontend | undefined;
    if (f) {
      const kind = f.frameworkKind;
      if (kind === "vue2") {
        // TODO vue2
      } else {
        // TODO react
      }
    } else {
      throw new Error(`no such frontend: ${path}`);
    }
  }
}

export default compile;
