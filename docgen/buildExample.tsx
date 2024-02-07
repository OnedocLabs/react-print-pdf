import { config } from "dotenv";

import { EnrichedExample } from "./types";
import { Onedoc } from "@onedoc/client";
import { bundle, formatSnippet } from "./utils";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { fromBuffer } from "pdf2pic";
import { glob } from "glob";

config({ path: ".env.local" });
config();

const onedoc = new Onedoc(process.env.ONEDOC_API_KEY!);

const baseCss = fs.readFileSync(path.join(__dirname, "./base.css"));

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
      assets: [
        {
          path: "base.css",
          content: baseCss,
        },
      ],
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
  const pdf = await glob(path.join(targetFolder, "*.pdf"));
  const imagePath = path.relative(path.join(__dirname, "../docs/"), pages[0]);
  const pdfPath = path.relative(path.join(__dirname, "../docs/"), pdf[0]);

  if (example.description) {
    markdown += `${example.description}\n\n`;
  }

  markdown += `<Frame type="glass"><img className="shadow shadow-black/20" src="${imagePath}" style={{ height: '400px' }} /></Frame>\n\n`;

  // Check if the folder docs/previews contain the image

  markdown += `<div style={{paddingTop: "1rem", paddingBottom: "1rem"}}><CodeGroup>
\`\`\`jsx template.tsx
import { ${component} } from "@onedoc/react-print";

${snippet}
\`\`\`
\`\`\`css base.css
${baseCss}
\`\`\`
</CodeGroup></div>\n\n`;

  markdown += `<a href="${pdfPath}">Download the PDF example ↓</a>\n\n`;

  return {
    markdown,
  };
};
