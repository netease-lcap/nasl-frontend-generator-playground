import {
  App,
  Frontend,
  genBundleFiles,
  type CommonAppConfig,
  Logger,
  compileAsProject,
} from "@lcap/nasl";
import { lightJoin } from "light-join";
import { makeContainer } from "./container";
import { envs } from "./envs";
import { loadNaslCompilerObject, tempUtils } from "./utils";

export type PathContent = { path: string; content: string };

async function init(app: App, config: CommonAppConfig) {
  await tempUtils.getAndLoadPackageInfos(app, {
    staticUrl: config.STATIC_URL,
    // TODO wudengke 拿到完全的版本号
    fullVersion: "3.9.3",
  });
}

export async function translate(
  config: CommonAppConfig
): Promise<PathContent[]> {
  const logger = Logger("translate");
  const container = await makeContainer();
  const { app, isFull, updatedModules } = await loadNaslCompilerObject(
    envs.naslZlibObjectPath
  );

  await init(app, config);

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
        const files: NameContent[] = genBundleFiles(
          app,
          frontendNode,
          config as any
        );

        const frontendPath = frontendNode.path;

        function transformFileNameToObjectKey(files: NameContent[]) {
          const filesInObjectKey = files.map(({ name, content }) => {
            // name 的例子 "//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/02195780-b1da-450b-a95e-d93147f02d7c/dev/m/22042518.min.js"
            const startingMarks = lightJoin(
              config.STATIC_URL,
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
          return { path: pathWithFrontend, content: v.code };
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
