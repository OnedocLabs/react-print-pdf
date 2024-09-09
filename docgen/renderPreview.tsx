import { config } from "dotenv";

import { FileforgeClient } from "@fileforge/client";
import * as crypto from "crypto";
import * as path from "path";
import * as fs from "fs";
import { fromBuffer } from "pdf2pic";
import { glob } from "glob";
import { compile, CompileOptions } from "../dist";
import React from "react";
import { pipeline } from "stream/promises";

config({ path: ".env.local" });
config();

const ff = new FileforgeClient({
  apiKey: process.env.ONEDOC_API_KEY!,
});

export const baseCss = fs.readFileSync(path.join(__dirname, "./base.css"));
export const indexCss = fs.readFileSync(
  path.join(__dirname, "../dist/index.css")
);

export async function renderPreview(
  component: React.ReactElement,
  componentName: string,
  outputPath: string,
  useBaseCss: boolean = true,
  compileOptions?: CompileOptions
) {
  const Component = component;
  const Element = <>{Component}</>;

  const html = `<!doctype html><html><head>
          <link rel="stylesheet" href="base.css" />
          <link rel="stylesheet" href="index.css" />
          </head><body>${await compile(Element, compileOptions)}</body></html>` as string;

  const hash = crypto.createHash("sha256");
  hash.update(html);

  let id = hash.digest("hex");
  id = componentName.replace(/ /g, "-").toLowerCase() + "-" + id.slice(0, 8);

  const targetFolder = path.join(__dirname, `../docs/images/previews/${id}/`);

  // If the file doesn't exist, create it by generating the document with Onedoc
  if (!fs.existsSync(targetFolder)) {
    const file = await ff.pdf.generate(
      [
        new File([html], "index.html", { type: "text/html" }),
        useBaseCss
          ? new File([baseCss], "base.css", { type: "text/css" })
          : new File([`@page { size: A4; }`], "base.css", { type: "text/css" }),
        new File([indexCss], "index.css", { type: "text/css" }),
      ],
      {
        options: {
          host: false,
          test: false,
        },
      }
    );

    // Create the directory
    fs.mkdirSync(targetFolder, { recursive: true });

    // Write the HTML to a file
    fs.writeFileSync(path.join(targetFolder, "index.html"), html);

    await pipeline(
      file,
      fs.createWriteStream(path.join(targetFolder, "document.pdf"))
    );

    const buffer = fs.readFileSync(path.join(targetFolder, "document.pdf"));

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
  const imagePath = path.relative(path.dirname(outputPath), pages[0]);
  const pdfPath = path.relative(path.dirname(outputPath), pdf[0]);

  return {
    imagePath,
    pdfPath,
  };
}
