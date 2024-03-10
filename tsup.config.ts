import { defineConfig } from "tsup";
import { RawPlugin } from "./build/raw";

export default defineConfig({
  entry: ["src/index.ts", "src/mdx.ts", "src/server.ts", "src/client.ts"],
  splitting: false,
  sourcemap: true,
  clean: false,
  format: ["cjs", "esm"],
  dts: true,
  esbuildPlugins: [RawPlugin()],
  bundle: true,
});
