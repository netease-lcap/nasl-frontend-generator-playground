import type { makeDefaultContainer } from "@lcap/nasl";

export type NASLFrontendGeneratorPlugin = {
    containerMaker: NASLFrontendGeneratorPluginContainerMaker;
    description: NASLFrontendGeneratorPluginDescription;
    cleanup: () => void;
};
export type NASLFrontendGeneratorPluginDescription = {
    name: string;
    version: string;
    ideVersion: string;
    description: string;
    endType: string;
    symbol: string;
};

export type NASLFrontendGeneratorContainer = ReturnType<typeof makeDefaultContainer>;
export type NASLFrontendGeneratorPluginContainerMaker = () => (Promise<NASLFrontendGeneratorContainer> | NASLFrontendGeneratorContainer);
