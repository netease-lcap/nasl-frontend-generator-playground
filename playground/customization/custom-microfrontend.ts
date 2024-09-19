import {
  GeneratorInfrastructureDomain,
  JavaScriptDomain,
  MicroFrontendPlugin,
  NASLAppIR,
  ServiceMetaKind,
} from "@lcap/nasl-unified-frontend-generator";
import { Frontend } from "@lcap/nasl/index";
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

  container.bind(MicroFrontendPlugin).to(MicroFrontendPlugin);

  container
    .rebind(ServiceMetaKind.MicroFrontendManager)
    .to(MyMicroFrontendPlugin);

  return container;
}
