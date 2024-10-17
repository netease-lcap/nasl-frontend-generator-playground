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
