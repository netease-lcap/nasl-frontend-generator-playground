import type { Frontend } from "@lcap/nasl-concepts";
import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";
import { lightJoin } from "light-join";
import { applyCustomization } from "./container";
// import { makeContainer } from "./container";
import { envs } from "./envs";
import { GeneratorConfig } from "./types";
import { loadNaslCompilerObject, tempUtils } from "./utils";
import { Logger, compileAsProject } from "@lcap/nasl-unified-frontend-generator";
import { genBundleFiles } from "@lcap/nasl";

export type PathContent = { path: string; content: string };

async function initApp(config: GeneratorConfig) {
  const { app, isFull, updatedModules } = await loadNaslCompilerObject(
    envs.naslZlibObjectPath
  );
  await tempUtils.getAndLoadPackageInfos(app, {
    staticUrl: config.STATIC_URL,
    fullVersion: config.fullVersion,
  });
  return { app, isFull, updatedModules };
}

export async function translate(
  config: GeneratorConfig
): Promise<PathContent[]> {
  const logger = Logger("translate");
  let container = makeDefaultContainer();

  // 兼容旧版插件
  // 旧版插件会提供一个用于生成 container 的方法
  // if (makeContainer) {
  //   container = await makeContainer();
  // }

  // 新版插件
  // 新版插件会提供一个 applyCustomization 方法，用于执行自定义逻辑，接收一个 container，返回一个 container
  if (applyCustomization) {
    container = await applyCustomization(container);
  }

  const { app, isFull, updatedModules } = await initApp(config);

  // 上层比较出来的所有变更路径的数组
  const res: PathContent[] = [];
  const selectedFrontends = envs.frontendOptions.filter((f) => f.selected);
  for (const f of selectedFrontends) {
    const path = `app.frontendTypes[name=${f.type}].frontends[name=${f.name}]`;
    const frontendNode = app.findNodeByPath(path) as Frontend | undefined;
    if (frontendNode) {
      const kind = frontendNode.frameworkKind;
      const frontendName = frontendNode.name;
      if (kind === "vue2") {
        (config as any).diffNodePaths = updatedModules;
        (config as any).isFull = isFull;
        type NameContent = { name: string; content: string };
        // 生成bundle文件，返回文件以及路径
        const files: NameContent[] = await genBundleFiles(
          app,
          frontendNode,
          config as any
        );

        const frontendPath = frontendNode.path;

        function transformFileNameToObjectKey(files: NameContent[]) {
          const filesInObjectKey = files.map(({ name, content }) => {
            // name 的例子 "//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/02195780-b1da-450b-a95e-d93147f02d7c/dev/m/22042518.min.js"
            const startingMarks = lightJoin(
              config.USER_STATIC_URL,
              config.tenant,
              app.id,
              config.env,
              frontendPath
            );
            const normalizedName = lightJoin(
              `/${frontendName}`,
              "/dist",
              name.replace(startingMarks, "")
            );
            return {
              path: normalizedName,
              content,
            };
          });
          return filesInObjectKey;
        }
        const filesInObjectKey = transformFileNameToObjectKey(files);
        res.push(...filesInObjectKey);
      } else if (kind === "react") {
        const project = await compileAsProject(
          app,
          frontendNode,
          config as any,
          container
        );
        const dict = project.getFileDict().files;
        const files = Object.entries(dict).map(([k, v]) => {
          const pathWithFrontend = lightJoin(`/${frontendName}`, k);
          return { path: pathWithFrontend, content: v.code.toString() };
        });
        logger.info(files.map((x) => x.path));
        res.push(...files);
      } else {
        throw new Error("not implemented");
      }
    } else {
      throw new Error(`no such frontend: ${path}`);
    }
  }
  return res;
}
