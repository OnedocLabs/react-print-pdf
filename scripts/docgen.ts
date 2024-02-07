import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

import * as docgen from "react-docgen-typescript";

const options: docgen.ParserOptions = {
  savePropValueAsString: true,
  propFilter: {
    skipPropsWithoutDoc: true,
  },
};

type docConfig = {
  name: string;
  icon: string;
};

type docFile = {
  name: string;
  markdown: string;
  path: string;
};

// List all the .tsx files in the ./src directory
const files = glob.sync(path.join(__dirname, "../src/**/*.tsx"));

const extractConfig = (fileContents: string) => {
  // Just parse till the line export const _docConfig = { ... } and extract it with regex then exec it.
  const docConfig = /export +const +_docConfig += +({[^}]+})/g.exec(
    fileContents
  );

  // If there is a match, return the group 1 of the match and its exec
  if (docConfig) {
    const contents = docConfig[1];
    const exec = new Function(`return ${contents}`)();

    return exec;
  }

  return {};
};

const formatCamelCaseToTitle = (str: string) => {
  // Convert camelCase to Title Case with spaces
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const docFiles = files
  .map((filePath) => {
    console.log(filePath);

    const types = docgen.parse(filePath, options);

    if (types.length === 0) {
      return false;
    }

    const inFileConfig = extractConfig(fs.readFileSync(filePath, "utf-8"));

    const config: docConfig = Object.assign(
      {
        name: formatCamelCaseToTitle(path.basename(filePath, ".tsx")),
        icon: "react",
      } satisfies docConfig,
      inFileConfig
    );

    let markdown = `---
title: ${config.name}
---
# ${config.name}\n\n`;

    types.forEach((component) => {
      markdown += `## ${component.displayName}\n\n`;

      if (component.description) {
        markdown += `${component.description}\n\n`;
      }

      markdown += `### Props\n\n`;

      if (component.props) {
        Object.keys(component.props).forEach((propName) => {
          const prop = component.props[propName];

          markdown += `#### ${propName}\n\n`;

          if (prop.description) {
            markdown += `${prop.description}\n\n`;
          }

          markdown += `Type: \`${prop.type.name}\`\n\n`;

          if (prop.defaultValue) {
            markdown += `Default: \`${prop.defaultValue.value}\`\n\n`;
          }
        });
      }
    });

    return {
      name: path.basename(filePath, ".tsx"),
      markdown,
      path: filePath,
    };
  })
  .filter(Boolean) as docFile[];

docFiles.forEach((docFile) => {
  const outPath = path.join(
    __dirname,
    `../docs/components/${docFile.name}.mdx`
  );

  fs.writeFileSync(outPath, docFile.markdown);
});

// Write to the ./docs/mint.json file, replacing the contents of the "components" key with the new components
const mintPath = path.join(__dirname, "../docs/mint.json");

const mint = JSON.parse(fs.readFileSync(mintPath, "utf-8"));

mint.navigation.forEach((navItem, index) => {
  if (navItem.group === "Components") {
    mint.navigation[index].pages = docFiles.map((docFile) => {
      return `components/${docFile.name}`;
    });
  }
});

fs.writeFileSync(mintPath, JSON.stringify(mint, null, 2));
