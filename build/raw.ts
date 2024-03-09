import { Plugin } from "esbuild";
import { readFileSync } from "fs";
import path from "path";

export const RawPlugin: () => Plugin = () => {
  return {
    name: "inline-style",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\?raw$/ }, (args) => {
        return {
          path: args.path,
          pluginData: {
            isAbsolute: path.isAbsolute(args.path),
            resolveDir: args.resolveDir,
          },
          namespace: "raw-loader",
        };
      });

      onLoad({ filter: /.*/, namespace: "raw-loader" }, async (args) => {
        const resolvedPath = path.resolve(
          args.pluginData.resolveDir,
          args.path.replace(/\?raw$/, "")
        );

        console.log("Resolving");

        let contents = "";

        try {
          contents = readFileSync(resolvedPath, "utf-8");
        } catch (e) {
          console.error(e);
        }

        return {
          contents,
          loader: "text",
        };
      });
    },
  };
};
