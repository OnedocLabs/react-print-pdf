import { EnrichedExample, Example } from "./types";
import { Onedoc } from "@onedoc/client";
import { bundle, formatSnippet } from "./utils";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { fromBuffer } from "pdf2pic";
import { glob } from "glob";

const onedoc = new Onedoc("");

export const buildExample = async (
  example: EnrichedExample,
  component: string,
  style: string
) => {
  let markdown = ``;

  const snippet = formatSnippet(example.templateString);

  const html = bundle(example.template, style);

  console.log(html);

  const hash = crypto.createHash("sha256");
  hash.update(html);

  let id = hash.digest("hex");
  id = component.replace(" ", "-").toLowerCase() + "-" + id.slice(0, 8);

  const targetFolder = path.join(__dirname, `../docs/images/previews/${id}/`);

  // If the file doesn't exist, create it by generating the document with Onedoc
  if (!fs.existsSync(targetFolder)) {
    const { file, info, error } = await onedoc.render({
      html,
      save: false,
      test: false,
    });

    if (error) {
      throw new Error(`Error rendering the document: ${error}`);
    }

    // Create the directory
    fs.mkdirSync(targetFolder, { recursive: true });

    const buffer = Buffer.from(file);

    // Save the buffer to a file called id.pdf
    fs.writeFileSync(path.join(targetFolder, "document.pdf"), buffer);

    const pdf2pic = fromBuffer(buffer, {
      density: 300,
      saveFilename: "document",
      savePath: targetFolder,
      format: "jpg",
      preserveAspectRatio: true,
      width: 1920,
    });

    const pages = await pdf2pic();

    console.log(pages);
  }

  const pages = await glob(path.join(targetFolder, "*.jpg"));
  const imagePath = path.relative(path.join(__dirname, "../docs/"), pages[0]);

  markdown += `<Frame type="glass"><img src="${imagePath}" style={{height: '400px'}} /></Frame>\n\n`;

  // Check if the folder docs/previews contain the image

  markdown += `\`\`\`jsx\n${snippet}\n\`\`\`\n\n`;

  return {
    markdown,
  };
};
