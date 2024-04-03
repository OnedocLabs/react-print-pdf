import { defineConfig } from "tsup";
import { RawPlugin } from "./build/raw";
import plugin from "node-stdlib-browser/helpers/esbuild/plugin";
import stdLibBrowser from "node-stdlib-browser";

export default defineConfig({
  entry: ["src/index.ts", "src/mdx.ts", "src/server.ts", "src/client.ts"],
  splitting: false,
  sourcemap: true,
  clean: false,
  format: ["cjs", "esm"],
  platform: "browser",
  dts: true,
  esbuildOptions: (options) => {
    options.inject = ["node-stdlib-browser/helpers/esbuild/shim"];
    options.define = {
      url: "url",
      tty: "tty",
      fs: "fs",
      path: "path",
      process: "process",
    };
  },
  esbuildPlugins: [RawPlugin(), plugin(stdLibBrowser)],
  external: ["react", "react-dom"],
  bundle: true,
});
