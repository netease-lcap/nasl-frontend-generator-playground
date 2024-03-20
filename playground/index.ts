import { IRBuilder, MicroFrontendManager, MicroFrontendPlugin, NASLAppIRBuilderPlugin, NASLTranspiler, ReactPresetPlugin, ServiceMetaKind } from "@lcap/nasl-unified-frontend-generator";
import { startDemoTranslation } from "@lcap/nasl-unified-frontend-generator/dist/playground";
import { Container } from 'inversify';

const container = new Container();
container.bind<NASLTranspiler>(ServiceMetaKind.NASLTranspiler).to(ReactPresetPlugin);
container.bind<IRBuilder>(ServiceMetaKind.IRBuilder).to(NASLAppIRBuilderPlugin);
container
  .bind<MicroFrontendManager>(ServiceMetaKind.MicroFrontendManager)
  .to(MicroFrontendPlugin);

startDemoTranslation(container).catch((error) => {
  console.error(error);
});
