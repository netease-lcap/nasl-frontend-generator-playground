import { Frontend, genBundleFiles } from "@lcap/nasl";
import {
  CommonAppConfig,
  Logger,
  compileAsProject,
} from "@lcap/nasl-unified-frontend-generator";
import { lightJoin } from "light-join";
import { envs } from "./envs";
import { loadNaslCompilerObject } from "./utils";
import { makeContainer } from "./container";

export type PathContent = { path: string; content: string };

export async function translate(
  config: CommonAppConfig
): Promise<PathContent[]> {
  const logger = Logger("translate");
  const container = makeContainer();
  const { app, isFull, updatedModules } = await loadNaslCompilerObject();
  // 上层比较出来的所有变更路径的数组
  const res: PathContent[] = [];
  const selectedFrontends = envs.frontendOptions.filter((f) => f.selected);
  for (const f of selectedFrontends) {
    const path = `app.frontendTypes[name=${f.name}].frontends[name=${f.name}]`;
    const frontendNode: Frontend | undefined = app.findNodeByPath(path);
    if (frontendNode) {
      const kind = frontendNode.frameworkKind;
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
        function transformFileNameToObjectKey(files: NameContent[]) {
          const filesInObjectKey = files.map(({ name, content }) => {
            // name 的例子 "//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/02195780-b1da-450b-a95e-d93147f02d7c/dev/22042518.min.js"
            const startingMarks = `${config.STATIC_URL}/${config.tenant}/${app.id}/${config.env}`;
            const normalizedName = lightJoin(
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
          await container
        );
        const dict = project.getFileDict().files;
        const files = Object.entries(dict).map(([k, v]) => {
          return { path: k, content: v.code };
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
