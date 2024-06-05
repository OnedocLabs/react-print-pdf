import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";
import { build } from "tsup";
import * as docgen from "react-docgen-typescript";
import * as yaml from "js-yaml";
import { DocConfig } from "./types";
import {
  formatCamelCaseToTitle,
  getTemplateContents,
  mergeTemplateInfo,
} from "./utils";
import { buildFileMarkdown } from "./buildFileMarkdown";
import { buildTemplateList, buildTemplates } from "./buildTemplates";
import { RawPlugin } from "../build/raw";
import { TabPanel } from "@chakra-ui/react";
import { Component } from "react";
import { check, doc } from "prettier";
import { replaceInFile } from "./pageBuilder/buildIntroduction";

const tmpDir = path.join(__dirname, "../.tmp");
const docsPath = path.join(__dirname, "../docs/components");

const options: docgen.ParserOptions = {
  savePropValueAsString: true,
  propFilter: {
    skipPropsWithoutDoc: true,
  },
};

type docFolder = {
  icon: string;
  name: string;
  description: string;
  outputPath: string;
  files: docFile[];
}

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

        const folderOutputPath:string = path.join(
          __dirname,
          `../docs/components/${path.basename(filePath, ".tsx")}`
        );

        let docFiles: docFile[] = [];

        for (const [componentName, value] of Object.entries(docConfig.components)) {

          const componentDocConfig = Object.assign(
            {
              name: componentName,
              description: "",
              components: {[componentName]: value},
            }
          );

          const outputPath = `${folderOutputPath}/${componentName.toLocaleLowerCase()}.mdx`;

          const componentType = types.filter(e=>e.displayName === componentName);

          const markdown = await buildFileMarkdown(componentDocConfig, componentType, outputPath);

          docFiles.push(
            {
              name: componentDocConfig.name,
              baseName: path.basename(filePath, ".tsx"),
              path: path
                .relative(path.join(__dirname, "../src"), filePath)
                .toLowerCase(),
              outputPath,
              markdown,
              config: componentDocConfig,
            }
          )

        }

        return {
          icon: docConfig.icon,
          name: docConfig.name,
          description: docConfig.description,
          outputPath: folderOutputPath,
          files: docFiles
        };;
        })
    )
  ).filter(Boolean) as docFolder[];

  // Check if the directory exists, if not, create it
  function checkDirectorySync(directory: string, remove: boolean = true) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    } else {
      if(remove){
        fs.rmSync(directory, { recursive: true });
      }
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  checkDirectorySync(docsPath);
  
  const sortedDocs = docs.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  fs.writeFileSync(path.join(__dirname , "../docs/sortedDocs.json"), JSON.stringify(sortedDocs)); //writes the object for future processing in fileforge-docs

  sortedDocs.forEach((docFile) => {
    docFile.files.forEach((file)=>{

      checkDirectorySync(docFile.outputPath, false);

      fs.writeFileSync(file.outputPath, file.markdown);
    })
  });

  // Build the card groups
  let snippet = `<Cards>`;

  sortedDocs.forEach((docFolder) => {

    const tempPath = "/react-print/components/"+docFolder.name;

    snippet += `<Card title="${docFolder.name}" icon="${
      docFolder.icon
    }" href="${tempPath.toLocaleLowerCase()}">
    ${docFolder.description.split(".")[0]}.
  </Card>`;
  });

  snippet += `</Cards>`;

  const snippetsPath = path.join(__dirname, "../docs/snippets");

  checkDirectorySync(snippetsPath);

  fs.writeFileSync(
    snippetsPath+"/components.mdx",
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
        return `/react-print/components/${docFile.baseName}`;
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

  //-------------------------------------------------------------------------------- GENERATE introduction.mdx FILE for Fern --------------------------------------------------------------------------------

  const introductionPath = path.join(__dirname, "../docs/introduction.mdx");

  replaceInFile(introductionPath, /<Cards>[\s\S]*?<\/Cards>/, snippet); //TODO: fix the relative component import in Fern to avoid this

  
};

process();
