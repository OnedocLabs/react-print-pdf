import { EnrichedExample } from "./types";
import { formatSnippet } from "./utils";
import { renderPreview, baseCss } from "./renderPreview";

export const buildExample = async (
  example: EnrichedExample,
  component: string,
  style: string,
  outputPath: string
) => {
  let markdown = ``;

  const snippet = formatSnippet(example.templateString);

  const paths = await renderPreview(
    example.template,
    component,
    outputPath,
    style
  );

  if (example.description) {
    markdown += `${example.description}\n\n`;
  }

  markdown += `<Frame type="glass"><img src="${paths.imagePath}" style={{ maxHeight: '400px', borderRadius: "0.25rem", overflow: "hidden" }} /></Frame>\n\n`;

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

  // markdown += `<a href="${pdfPath}">Download the PDF example ↓</a>\n\n`;

  return {
    markdown,
  };
};
