import { defineConfig } from "@rsbuild/core";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
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
    copy: [
      {
        from: path.resolve(__dirname, './playground/customization/dependences'),
        to: "dependences",
      },
    ],
    externals: [
      'pino', 
      '@abraham/reflection',
      'reflect-metadata',
    ],
  },
  server:{
    publicDir:{
      copyOnBuild: true
    }
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
