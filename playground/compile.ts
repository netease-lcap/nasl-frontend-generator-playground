import { Frontend, genBundleFiles } from "@lcap/nasl";
import { CommonAppConfig, Logger } from "@lcap/nasl-unified-frontend-generator";
import { envs } from "./envs";
import { readNASLApp } from "./utils";
import { lightJoin } from "light-join";

// TODO 移动一下位置
type NameContent = { name: string; content: string };
type DiffNodePath = string[];

const diffNodePaths: DiffNodePath[] = [
  [
    "app.frontendTypes[name=pc].frontends[name=pc]",
    "app.frontendTypes[name=pc].frontends[name=pc].views[name=dashboard]",
    "app.frontendTypes[name=pc].frontends[name=pc].views[name=dashboard].children[name=achievement]",
    "app.frontendTypes[name=pc].frontends[name=pc].views[name=dashboard].children[name=achievement].children[name=assetscenter]",
  ],
];

async function compile(config: CommonAppConfig) {
  const logger = Logger("compile");
  const app = await readNASLApp();
  // 上层比较出来的所有变更路径的数组
  const res: NameContent[] = [];
  const selectedFrontends = envs.FRONTENDS.filter((f) => f.selected);
  for (const f of selectedFrontends) {
    const path = `app.frontendTypes[name=${f.name}].frontends[name=${f.name}]`;
    const frontendNode: Frontend | undefined = app.findNodeByPath(path);
    if (frontendNode) {
      const kind = frontendNode.frameworkKind;
      if (kind === "vue2") {
        // TODO wudengke 传入diff
        // (config as any).diffNodePaths = diffNodePaths;
        // 生成bundle文件，返回文件以及路径
        const files: NameContent[] = genBundleFiles(
          app,
          frontendNode,
          config as any
        );
        function normalizeFileNames(files: NameContent[]) {
          const normalizedFiles = files.map(({ name, content }) => {
            // name 的例子 "//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/02195780-b1da-450b-a95e-d93147f02d7c/dev/22042518.min.js"
            const startingMarks = `${config.STATIC_URL}/${config.tenant}/${app.id}/${config.env}`;
            const normalizedName = lightJoin(
              "/",
              name.replace(startingMarks, "")
            );
            return {
              name: normalizedName,
              content,
            };
          });
          return normalizedFiles;
        }
        const normalized = normalizeFileNames(files);
        res.push(...normalized);
      } else if (kind === "react") {
        // TODO 实现 react
        throw new Error("TODO: react");
      } else {
        throw new Error("not implemented");
      }
    } else {
      throw new Error(`no such frontend: ${path}`);
    }
  }
  return res;
}

export default compile;
