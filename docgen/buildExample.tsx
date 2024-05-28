import { EnrichedExample } from "./types";
import { formatSnippet } from "./utils";
import { renderPreview, baseCss } from "./renderPreview";
import type { CompileOptions } from "../src/compile/compile";

export const buildExample = async (
  example: EnrichedExample,
  component: string,
  outputPath: string,
  compileOptions?: CompileOptions
) => {
  let markdown = ``;

  const snippet = await formatSnippet(example.templateString);

  const paths = await renderPreview(
    example.template,
    component,
    outputPath,
    true,
    compileOptions
  );

  if (example.description) {
    markdown += `${example.description}\n\n`;
  }

  markdown += `<Frame type="glass"><img src="${paths.imagePath}" style={{ maxHeight: '400px', borderRadius: "0.25rem", overflow: "hidden" }} /></Frame>\n\n`;

  // Check if the folder docs/previews contain the image

  markdown += `<div style={{paddingTop: "1rem", paddingBottom: "1rem"}}><CodeGroup>
\`\`\`jsx template.tsx
import { ${component}${
    example.imports ? `, ${example.imports.join(", ")}` : ""
  } } from "@fileforge/react-print";${
    example.externalImports ? `\n${example.externalImports.join("\n")}` : ""
  }

${snippet}
\`\`\`
\`\`\`css base.css
${baseCss}
\`\`\`
</CodeGroup></div>\n\n`;

  // markdown += `<a href="${pdfPath}">Download the PDF example ↓</a>\n\n`;

  return {
    markdown,
  };
};
