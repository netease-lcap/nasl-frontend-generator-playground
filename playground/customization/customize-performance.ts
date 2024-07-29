import {
  ServiceMetaKind,
  JavaScriptDomain,
} from "@lcap/nasl-unified-frontend-generator";
import { Container } from "inversify";

export function setupPerformanceOptions(container: Container) {
  const frontendPerformancePlugin =
    container.get<JavaScriptDomain.FrontendApplicationDomain.FrontendPerformance>(
      ServiceMetaKind.FrontendPerformance
    );

  frontendPerformancePlugin.setOptions({
    lazy: false,
    chunks: "async",
  });

  return container;
}
