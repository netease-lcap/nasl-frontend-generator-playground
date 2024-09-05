import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  output: {
    target: "node",
    minify: false,
    externals: ['pino'],
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
});
