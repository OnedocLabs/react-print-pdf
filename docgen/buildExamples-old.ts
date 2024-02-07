import { renderToString } from "react-dom/server";
import { Example } from "./types.js";
import fs from "fs";
import path from "path";
import parse from "css-to-style";
import juice from "juice";
import * as crypto from "crypto";

const reparseCss = (html: string) => {
  // Replace all style="" with style={{}} and parse the css.
  const styleRegex = /style="([^"]*)"/g;
  const matches = html.match(styleRegex);
  if (matches) {
    for (const match of matches) {
      const style = match.replace(/style="/, "").replace(/"/, "");
      const parsed = parse(style);
      const styleString = JSON.stringify(parsed);
      html = html.replace(match, `style={${styleString}}`);
    }
  }

  // Replace all class="" with className=""
  const classRegex = /class="([^"]*)"/g;
  const classMatches = html.match(classRegex);
  if (classMatches) {
    for (const match of classMatches) {
      html = html.replace(match, match.replace(/class="/, 'className="'));
    }
  }
  return html;
};

export const buildExample = async ({
  componentName,
  example,
}: {
  path: string;
  componentName: string;
  example: Example;
}) => {
  const components = await import("../dist/index.js");

  if (!components[componentName]) {
    throw new Error(`Component ${componentName} not found in export build.`);
  }

  const html = renderToString(components[componentName](example.props || {}));

  const parsed = `<style>
        \{\`${fs.readFileSync(
          path.join(__dirname, "../dist/index.css"),
          "utf-8"
        )}\`\}
      </style>
      ${html}`;

  // Hash the parsed contents
  const hash = crypto.createHash("sha256");
  hash.update(parsed);
  const id = hash.digest("hex");

  console.log(id);
  console.log(id);
  console.log(id);

  const sanitizedCss = juice(parsed);

  const output = reparseCss(sanitizedCss).replace("<!-- -->", " ");

  return {
    contents: `<Frame type="glass">
  <div style={{ flexGrow: 1, padding: '1rem' }}>
    <div style={{ all: 'initial' }}>
      ${output}
    </div>
  </div>
</Frame>`,
  };
};
