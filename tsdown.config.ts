import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["cjs", "esm"],
  treeshake: true,
  publint: true,
  dts: true,
  sourcemap: false,
  minify: {
    compress: false,
    mangle: true,
    codegen: false,
  },
  outputOptions: {
    comments: {
      jsdoc: false,
    },
  },
  clean: true,
});
