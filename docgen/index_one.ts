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
              components: [value],
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

  // console.log(docs)
  // console.log(docs.length)
  // docs[0].files.forEach(e=>{
  //    console.log(e)
  // }) 

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

  sortedDocs.forEach((docFile) => {
    docFile.files.forEach((file)=>{

      checkDirectorySync(docFile.outputPath, false);

      fs.writeFileSync(file.outputPath, file.markdown);
    })
  });

  // Build the card groups
  let snippet = `<Cards>`;

  sortedDocs.forEach((docFolder) => {
    const href = path
      .relative(path.join(__dirname, "../docs"), docFolder.outputPath)
      .replace(".mdx", "");

    snippet += `<Card title="${docFolder.name}" icon="${
      docFolder.icon
    }" href="${href}">
    ${docFolder.description.split(".")[0]}.
  </Card>`;
  });

  snippet += `</Cards>`;

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
  
  //-------------------------------------------------------------------------------- GENERATE DOCS.YML FILE for Fern --------------------------------------------------------------------------------
  // genreating the docs.yml file with dynamic content for components
  const docYMLFile = path.join(__dirname, "../docs/docs.yml");

  // Load and parse the YAML file
  const docsYml:any = yaml.load(fs.readFileSync(__dirname+'/docs.yml', 'utf8'));
  // Get the Components section
  const componentsSection = docsYml.navigation.find(section => section.tab === 'react-print').layout.find(section => section.section === 'Components');

  const subdirs = fs.readdirSync(docsPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

  subdirs.forEach(subdir => {
  // Create a new section for the subdirectory
  const newSection = {
    section: subdir,
    contents: []
  };

  // Get all mdx files in the subdirectory
  const mdxFiles = fs.readdirSync(path.join(docsPath, subdir)).filter(file => path.extname(file) === '.mdx');

  // Add each mdx file to the new section
  mdxFiles.forEach(file => {
    const slug = path.basename(file, '.mdx');
    newSection.contents.push(
      {
        page: slug.charAt(0).toUpperCase() + slug.slice(1),
        path: `../react-print-pdf/docs/components/${subdir}/${file}`,
        slug: slug
      });
  });

  // Add the new section to componentsSection.contents
  componentsSection.contents.push(newSection);
});

  // Convert the updated object back into YAML
  const updatedYaml = yaml.dump(docsYml);

  // Write the updated YAML back to the file
  fs.writeFileSync(docYMLFile, updatedYaml, 'utf8');

  

};

process();
