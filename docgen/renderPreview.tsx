import { config } from "dotenv";

import { Onedoc } from "@onedoc/client";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { fromBuffer } from "pdf2pic";
import { glob } from "glob";
import { compile, CompileOptions } from "../dist";
import React from "react";

config({ path: ".env.local" });
config();

const onedoc = new Onedoc(process.env.ONEDOC_API_KEY!);

export const baseCss = fs.readFileSync(path.join(__dirname, "./base.css"));
export const indexCss = fs.readFileSync(
  path.join(__dirname, "../dist/index.css")
);

export function buildUrlFromDocsToHosted(path:string) {  
  const github_base_url = 'https://github.com/OnedocLabs/react-print-pdf/blob/ffo-48-include-documentation-for-the-react-print-library-with/docs'
  const regex = /\/docs(.*)/;
  const match = path.match(regex);

  if (match && match[1]) {
    console.log(match[1]); // Outputs: /images/previews/footnote-fb378308/document.1.jpg
    return github_base_url + match[1] + '?raw=true';
  }
}

export async function renderPreview(
  component: React.ReactElement,
  componentName: string,
  outputPath: string,
  useBaseCss: boolean = true,
  compileOptions?: CompileOptions
) {
  const Component = component;
  const Element = <>{Component}</>;

  const html = (await compile(Element, compileOptions)) as string;

  const hash = crypto.createHash("sha256");
  hash.update(html);

  let id = hash.digest("hex");
  id = componentName.replace(/ /g, "-").toLowerCase() + "-" + id.slice(0, 8);

  const targetFolder = path.join(__dirname, `../docs/images/previews/${id}/`);

  // If the file doesn't exist, create it by generating the document with Onedoc
  if (!fs.existsSync(targetFolder)) {
    const { file, info, error } = await onedoc.render({
      html,
      assets: [
        ...(useBaseCss
          ? [
              {
                path: "base.css",
                content: baseCss,
              },
            ]
          : [
              {
                path: "default.css",
                content: Buffer.from(`@page { size: A4; }`),
              },
            ]),
        {
          path: "index.css",
          content: indexCss,
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

    // Write the HTML to a file
    fs.writeFileSync(path.join(targetFolder, "index.html"), html);

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

    let currentPage = 1;

    while (true) {
      try {
        await pdf2pic(currentPage);
      } catch (e) {
        break;
      }

      currentPage++;
    }
  }

  const pages = (await glob(path.join(targetFolder, "*.jpg"))).sort();
  const pdf = await glob(path.join(targetFolder, "*.pdf"));
  const imagePath = buildUrlFromDocsToHosted(pages[0]);
  const pdfPath = buildUrlFromDocsToHosted(pdf[0]);

  return {
    imagePath,
    pdfPath,
  };
}
