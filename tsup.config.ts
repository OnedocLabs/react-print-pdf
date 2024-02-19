import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/mdx.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
  esbuildPlugins: [],
});
