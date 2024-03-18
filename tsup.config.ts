import { defineConfig } from "tsup";
import { RawPlugin } from "./build/raw";
import { commonjs } from "@hyrious/esbuild-plugin-commonjs";

export default defineConfig({
  entry: ["src/index.ts", "src/mdx.ts", "src/server.ts", "src/client.ts"],
  splitting: false,
  sourcemap: true,
  clean: false,
  format: ["cjs", "esm"],
  dts: true,
  esbuildPlugins: [RawPlugin(), commonjs()],
  bundle: true,
});
