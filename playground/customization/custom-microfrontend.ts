import {
  JavaScriptDomain,
  MicroFrontendPlugin,
  NASLAppIR,
  ServiceMetaKind,
} from "@lcap/nasl-unified-frontend-generator";
import { Container, inject, injectable } from "inversify";

export function setupMicrofrontend(container: Container) {
  @injectable()
  class MyMicroFrontendPlugin
    implements JavaScriptDomain.FrontendApplicationDomain.MicroFrontendManager
  {
    constructor(
      @inject(MicroFrontendPlugin)
      private oldMicroFrontendPlugin: MicroFrontendPlugin
    ) {}
    producePublicPathScript(ir: NASLAppIR): string | undefined {
      const framework = ir.configs.microApp?.framework;
      if (framework === "qiankun") {
        return `
      if (window.__POWERED_BY_QIANKUN__) {
        window.__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
      }
      `;
      } else if (framework === "wujie") {
        return `
      if (window.__POWERED_BY_WUJIE__) {
        window.__webpack_public_path__ = window.__WUJIE_PUBLIC_PATH__;
      }
      `;
      }
      return undefined;
    }
    produceScript(ir: NASLAppIR): string {
      const oldScript = this.oldMicroFrontendPlugin.produceScript(ir);
      return `/** 微前端脚本开始 */\n${oldScript} /** 微前端脚本结束 */`;
    }
  }

  // 将MicroFrontendPlugin注入到MicroFrontendPlugin
  // MicroFrontnedPlugin对象本身也可以作为一个注入标识符
  container.bind(MicroFrontendPlugin).to(MicroFrontendPlugin);

  // 将ServiceMetaKind.MicroFrontendManager替换为MyMicroFrontendPlugin
  container
    .rebind(ServiceMetaKind.MicroFrontendManager)
    .to(MyMicroFrontendPlugin);

  return container;
}
