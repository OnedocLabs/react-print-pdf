import { DocConfig } from "docgen/types";
import { readFileSync } from "fs";
import React from "react";

export const compile = async (node: React.ReactElement) => {
  const ReactDOMServer = await import("react-dom/server");

  // Dynamically import the css file at @onedoc/react-print/index.css
  const css = readFileSync(
    require.resolve("@onedoc/react-print/dist/index.css"),
    "utf-8"
  );

  return ReactDOMServer.renderToString(
    <>
      <style>{css}</style>
      {node}
    </>
  );
};

export const __docConfig: DocConfig = {
  name: "compile",
  icon: "code",
  description:
    "Compile a React component to a string with the OneDoc print styles.",
  components: {
    compile: {
      examples: {},
    },
  },
};
