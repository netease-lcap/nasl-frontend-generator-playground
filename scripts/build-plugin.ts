import { confirm, input } from "@inquirer/prompts";
import fs from "fs-extra";
import path from "path";
import inc from "semver/functions/inc";
import { v4 as uuidV4 } from "uuid";
import { createRsbuild, loadConfig } from "@rsbuild/core";
import { zip } from "zip-a-folder";

const descriptionFilePath = path.join(__dirname, "../public/description.json");

type TranslatorPluginDescription = {
  symbol: string;
  name: string;
  version: string;
  ideVersion: string;
  description: string;
  endType: string;
};

async function build() {
  const config = await loadConfig();
  const rsbuild = await createRsbuild({ rsbuildConfig: config.content });
  await rsbuild.build();
}

async function pack() {
  const inPath = path.join(__dirname, "../dist");
  const packedPath = path.join(__dirname, `../plugin.zip`);
  await zip(`${inPath}`, packedPath, { destPath: "/" });
  return { packedPath };
}

async function main() {
  const descriptionExists = fs.existsSync(descriptionFilePath);
  if (!descriptionExists) {
    const descObj: TranslatorPluginDescription = {
      name: await input({
        message: "请输入插件名",
        default: "我的翻译器插件",
      }),
      version: await input({
        message: "请输入插件版本号",
        default: "1.0.0",
      }),
      ideVersion: "3.8",
      description: "测试",
      endType: "frontend",
      symbol: uuidV4(),
    };
    fs.writeJsonSync(descriptionFilePath, descObj, { spaces: 2 });
  } else {
    const desc: TranslatorPluginDescription =
      fs.readJsonSync(descriptionFilePath);
    const version = desc.version;
    const res = await confirm({
      message: `是否更新[${desc.name}@${desc.version}]的版本号`,
    });
    if (res) {
      const newVersion = await input({
        message: `请输入新的版本号`,
        default: inc(version, "patch") ?? version,
      });
      desc.version = newVersion;
    }
    fs.writeJSONSync(descriptionFilePath, desc, { spaces: 2 });
  }
  const desc: TranslatorPluginDescription =
    fs.readJsonSync(descriptionFilePath);
  console.log(desc);
  console.log("开始打包插件");
  await build();
  const { packedPath } = await pack();
  console.log(`打包完成`);
  console.log(`压缩包路径: ${packedPath}`);
}

main();
