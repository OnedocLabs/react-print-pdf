import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";

import * as docgen from "react-docgen-typescript";
import { buildExample } from "./buildExamples";
import { DocConfig } from "./types";

const options: docgen.ParserOptions = {
  savePropValueAsString: true,
  propFilter: {
    skipPropsWithoutDoc: true,
  },
};

type docFile = {
  name: string;
  markdown: string;
  path: string;
};

// List all the .tsx files in the ./src directory
const files = glob.sync(path.join(__dirname, "../src/**/*.tsx"));

const extractConfig = (filePath: string) => {
  // use typescript to parse the ast and find a varialble named _docConfig
  const fileContents = fs.readFileSync(filePath, "utf-8");

  const sourceFile = ts.createSourceFile(
    filePath,
    fileContents,
    ts.ScriptTarget.ES2015,
    true
  );

  let config = {};

  sourceFile.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((declaration) => {
        if (declaration.name.getText() === "_docConfig") {
          const rawContents = declaration
            .getText()
            .split("=")
            .slice(1)
            .join("=")
            .trim();
          // Exec the raw contents to get the object
          config = eval(`(${rawContents})`);
        }
      });
    }
  });

  return config as DocConfig;
};

const formatCamelCaseToTitle = (str: string) => {
  // Convert camelCase to Title Case with spaces
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

// Clear the ./docs/components directory
const docsPath = path.join(__dirname, "../docs/components");

const process = async () => {
  const docFiles = (
    await Promise.all(
      files.map(async (filePath) => {
        console.log(filePath);

        const types = docgen.parse(filePath, options);

        if (types.length === 0) {
          return false;
        }

        const inFileConfig = extractConfig(filePath);

        const config: DocConfig = Object.assign(
          {
            name: formatCamelCaseToTitle(path.basename(filePath, ".tsx")),
            icon: "react",
            components: {},
          } satisfies DocConfig,
          inFileConfig
        );

        let imports = ``;
        let frontmatter = `title: ${config.name}`;
        let markdown = ``;

        for (const component of types) {
          const examples =
            config.components[component.displayName]?.examples || {};

          markdown += `## ${component.displayName}\n\n`;

          console.log(examples);

          if (examples.default) {
            const example = await buildExample({
              path: filePath,
              componentName: component.displayName,
              example: examples.default,
            });

            console.log(config);

            markdown += `${example.contents}\n\n`;
          }

          if (component.description) {
            markdown += `${component.description}\n\n`;
          }
        }

        return {
          name: path.basename(filePath, ".tsx"),
          markdown: `---
${frontmatter}
---
${imports}

${markdown}`,
          path: filePath,
        };
      })
    )
  ).filter(Boolean) as docFile[];

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  } else {
    fs.rmdirSync(docsPath, { recursive: true });
    fs.mkdirSync(docsPath, { recursive: true });
  }

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
};

process();
