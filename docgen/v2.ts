import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import { build } from "tsup";
import * as docgen from "react-docgen-typescript";
import { DocConfig } from "./types";
import {
  formatCamelCaseToTitle,
  getTemplateContents,
  mergeTemplateInfo,
} from "./utils";
import { buildFileMarkdown } from "./buildFileMarkdown";

const tmpDir = path.join(__dirname, "../.tmp");
const docsPath = path.join(__dirname, "../docs/components");

const options: docgen.ParserOptions = {
  savePropValueAsString: true,
  propFilter: {
    skipPropsWithoutDoc: true,
  },
};

type docFile = {
  name: string;
  baseName: string;
  markdown: string;
  path: string;
  outputPath: string;
  config: DocConfig;
};

const process = async () => {
  const files = glob.sync(path.join(__dirname, "../src/**/*.tsx"));

  const docs = (
    await Promise.all(
      files.map(async (filePath) => {
        await build({
          entry: [filePath],
          dts: false,
          outDir: tmpDir,
          format: "cjs",
          sourcemap: false,
          splitting: false,
          bundle: true,
          config: false,
          clean: true,
        });

        const entrypoint = path.join(
          tmpDir,
          path.basename(filePath, ".tsx") + ".js"
        );

        const elements = await import(entrypoint);

        const types = docgen.parse(filePath, options);

        let docConfig = Object.assign(
          {
            name: formatCamelCaseToTitle(path.basename(filePath, ".tsx")),
            description: "",
            components: {},
          } satisfies DocConfig,
          elements.__docConfig
        );

        const templates = getTemplateContents(filePath);

        docConfig = mergeTemplateInfo(docConfig, templates);

        const outputPath = path.join(
          __dirname,
          `../docs/components/${path.basename(filePath, ".tsx")}.mdx`
        );

        const markdown = await buildFileMarkdown(
          docConfig,
          types,
          fs.readFileSync(path.join(__dirname, "../dist/index.css"), "utf-8"),
          outputPath
        );

        return {
          name: docConfig.name,
          baseName: path.basename(filePath, ".tsx"),
          path: path
            .relative(path.join(__dirname, "../src"), filePath)
            .toLowerCase(),
          outputPath,
          markdown,
          config: docConfig,
        };
      })
    )
  ).filter(Boolean) as docFile[];

  console.log(docs);

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  } else {
    fs.rmdirSync(docsPath, { recursive: true });
    fs.mkdirSync(docsPath, { recursive: true });
  }

  const sortedDocs = docs.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  sortedDocs.forEach((docFile) => {
    fs.writeFileSync(docFile.outputPath, docFile.markdown);
  });

  // Write to the ./docs/mint.json file, replacing the contents of the "components" key with the new components
  const mintPath = path.join(__dirname, "../docs/mint.json");

  const mint = JSON.parse(fs.readFileSync(mintPath, "utf-8"));

  mint.navigation.forEach((navItem, index) => {
    if (navItem.group === "Components") {
      mint.navigation[index].pages = sortedDocs.map((docFile) => {
        return `components/${docFile.baseName}`;
      });
    }
  });

  fs.writeFileSync(mintPath, JSON.stringify(mint, null, 2));

  // Build the card groups
  let snippet = `<CardGroup>`;

  sortedDocs.forEach((docFile) => {
    const href = path
      .relative(path.join(__dirname, "../docs"), docFile.outputPath)
      .replace(".mdx", "");

    snippet += `<Card title="${docFile.name}" icon="${docFile.config.icon}" href="${href}">
    ${docFile.config.description}
  </Card>`;
  });

  snippet += `</CardGroup>`;

  fs.writeFileSync(
    path.join(__dirname, "../docs/snippets/components.mdx"),
    snippet
  );
};

process();
