import { makeDefaultContainer } from "@lcap/nasl-unified-frontend-generator";

// 样例：修改默认容器中的内容。替换makeContainer为如下代码
import { customizeExternal } from "./customization/custom-external";
export async function makeContainer() {
  const container = makeDefaultContainer(); // 构造默认容器
  return Promise.resolve(container)
    .then(customizeExternal);
}
