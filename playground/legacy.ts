import { GeneratorPluginLegacyAdaptor } from "../src/utils/generator-plugin-manager/legacy-adaptation/generator-plugin-adaptor";
import { makeContainer } from "./container";

export async function debugLegacy({
  clientPath,
  outputPath,
}: {
  clientPath: string;
  outputPath: string;
}) {
  const customContainer = await makeContainer();
  return GeneratorPluginLegacyAdaptor.create({
    clientPath,
    container: customContainer,
    outputPath,
  }).execute();
}
