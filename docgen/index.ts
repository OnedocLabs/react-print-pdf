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
import { buildTemplateList, buildTemplates } from "./buildTemplates";
import { RawPlugin } from "../build/raw";

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
  const files = glob
    .sync(path.join(__dirname, "../src/**/*.tsx"))
    .filter((filePath) => {
      return !filePath.includes("/src/ui/");
    });

  const docs = (
    await Promise.all(
      files.map(async (filePath) => {
        const relativePath = path.relative(
          path.join(__dirname, "../src"),
          filePath
        );

        const entrypoint = path.join(
          tmpDir,
          path.dirname(relativePath),
          path.basename(relativePath, ".tsx") + ".js"
        );

        await build({
          entry: [filePath],
          dts: false,
          outDir: path.dirname(entrypoint),
          format: "cjs",
          sourcemap: false,
          splitting: false,
          bundle: true,
          config: false,
          clean: true,
          esbuildPlugins: [RawPlugin()],
        });

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

        const markdown = await buildFileMarkdown(docConfig, types, outputPath);

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

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  } else {
    fs.rmSync(docsPath, { recursive: true });
    fs.mkdirSync(docsPath, { recursive: true });
  }

  const sortedDocs = docs.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  sortedDocs.forEach((docFile) => {
    fs.writeFileSync(docFile.outputPath, docFile.markdown);
  });

  // Build the card groups
  let snippet = `<CardGroup>`;

  sortedDocs.forEach((docFile) => {
    const href = path
      .relative(path.join(__dirname, "../docs"), docFile.outputPath)
      .replace(".mdx", "");

    snippet += `<Card title="${docFile.name}" icon="${
      docFile.config.icon
    }" href="${href}">
    ${docFile.config.description.split(".")[0]}.
  </Card>`;
  });

  snippet += `</CardGroup>`;

  fs.writeFileSync(
    path.join(__dirname, "../docs/snippets/components.mdx"),
    snippet
  );

  const templatesBuild = await buildTemplates();

  templatesBuild.forEach((template) => {
    const dirname = path.dirname(template.outputPath);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fs.writeFileSync(template.outputPath, template.markdown);
  });

  const templateListingPath = path.join(__dirname, "../docs/ui/templates.mdx");

  const templateListingContents = await buildTemplateList(
    templatesBuild,
    templateListingPath
  );

  fs.writeFileSync(templateListingPath, templateListingContents);

  // Write to the ./docs/mint.json file, replacing the contents of the "components" key with the new components
  const mintPath = path.join(__dirname, "../docs/mint.json");

  const mint = JSON.parse(fs.readFileSync(mintPath, "utf-8"));

  mint.navigation.forEach((navItem, index) => {
    if (navItem.group === "Components") {
      mint.navigation[index].pages = sortedDocs.map((docFile) => {
        return `components/${docFile.baseName}`;
      });
    } else if (navItem.group === "Templates") {
      // Group templates by category
      const categoryPages: {
        [key: string]: {
          group: string;
          icon?: string;
          pages: string[];
        };
      } = templatesBuild.reduce((acc, template) => {
        const category = template.category || "Uncategorized";
        const icon = template.icon;

        if (!acc[category]) {
          acc[category] = {
            group: category,
            icon: icon,
            pages: [],
          };
        }

        acc[category].pages.push(
          path.relative(
            path.join(__dirname, "../docs"),
            template.outputPath.replace(".mdx", "")
          )
        );

        return acc;
      }, {});

      const categorizedPages = Object.values(categoryPages).map((category) => {
        return {
          group: category.group,
          // icon: category.icon,
          pages: category.pages,
        };
      });

      // Replace the pages array with the new categorizedPages array
      mint.navigation[index].pages = ["ui/templates", ...categorizedPages];
    }
  });

  fs.writeFileSync(mintPath, JSON.stringify(mint, null, 2));
};

process();
