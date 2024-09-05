export default {
  output: {
    target: "node",
    minify: false,
    distPath: {
      server: "/",
    },
  },
  source: {
    entry: {
      plugin: "./playground/container.ts",
    },
    decorators: {
      version: "legacy",
    },
  },
};
