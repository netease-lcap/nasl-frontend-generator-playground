import { defineConfig } from "@rsbuild/core";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

export default defineConfig({
  output: {
    target: "node",
    minify: false,
    externals: ['pino', '@abraham/reflection'],
  },
  source: {
    entry: {
      plugin: {
        import: "./playground/container.ts",
      },
    },
    decorators: {
      version: "legacy",
    },
  },
  plugins: [pluginTypeCheck()],
});
