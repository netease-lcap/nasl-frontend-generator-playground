import { defineConfig, rspack } from "@rsbuild/core";
import path from 'node:path';


export default defineConfig({
  // plugins: [
  //   new rspack.CopyRspackPlugin()
  // ],
  // {
  //   patterns: [
  //     { from: path.resolve(__dirname, '/playground/dependences') },
  //   ]
  // }
  output: {
    target: "node",
    minify: false,
    externals: ['pino', '@abraham/reflection'],
    copy: [
      {
        from: path.resolve(__dirname, './playground/customization/dependences'),
        to: "dependences",
      },
    ]
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
