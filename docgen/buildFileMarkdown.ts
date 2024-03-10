import {
  ConfigComponentDoc,
  EnrichedExample,
  ExtendedDocConfig,
} from "./types";
import { ComponentDoc } from "react-docgen-typescript";
import { buildExample } from "./buildExample";
import { formatCamelCaseToTitle, safePropType } from "./utils";

export const buildFileMarkdown = async (
  docConfig: ExtendedDocConfig,
  componentDocs: ComponentDoc[],
  outputPath: string
) => {
  let markdown = `---
title: ${docConfig.name}
${docConfig.icon ? `icon: ${docConfig.icon}` : ""}
${docConfig.description ? `description: "${docConfig.description}"` : ""}
---\n\n`;

  const componentKeys = new Set([
    ...componentDocs.map((component) => component.displayName),
    ...Object.keys(docConfig.components),
  ]);

  for (const componentName of componentKeys) {
    let component = false as ComponentDoc | false;

    componentDocs.forEach((exportedComponent) => {
      if (exportedComponent.displayName === componentName) {
        component = exportedComponent as ComponentDoc;
      }
    });

    let componentInfo: ConfigComponentDoc<EnrichedExample> | false = false;

    let examples: {
      [key: string]: EnrichedExample;
    } = {};

    try {
      examples = docConfig.components[componentName].examples || {};
      componentInfo = docConfig.components[componentName] || false;
    } catch (e) {}

    let { client, server } = componentInfo || { client: true, server: true };

    markdown += `## ${componentName}\n\n`;

    markdown += `Support\n\n`;

    const check =
      '<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 512 512"><path fill="#22c55e" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
    const noCheck =
      '<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 512 512"><path fill="#ef4444" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>';

    markdown += `<div style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.5rem",
  }}><div className="flex items-center p-3 border rounded-md border-gray-700" style={{borderColor: '#374151'}}>${
    client ? check : noCheck
  }<span>Client-side</span></div><div className="flex items-center p-3 border rounded-md" style={{borderColor: '#374151'}}>${
    server ? check : noCheck
  }<span>Server-side</span></div></div>\n\n`;

    if (component && component.description) {
      markdown += `${component.description}\n\n`;
    }

    if (Object.keys(examples).length > 0) {
      markdown += `### Examples\n\n`;

      if (examples.default) {
        markdown += `#### Preview\n\n`;

        const { markdown: exampleMarkdown } = await buildExample(
          examples.default,
          componentName,
          outputPath,
          examples.default.compileOptions
        );

        markdown += exampleMarkdown;
      }

      if (Object.keys(examples).filter((key) => key !== "default").length > 0) {
        for (const [exampleName, example] of Object.entries(examples)) {
          if (exampleName === "default") {
            continue;
          }

          markdown += `#### ${
            example.name || formatCamelCaseToTitle(exampleName)
          }\n\n`;

          const { markdown: exampleMarkdown } = await buildExample(
            example,
            componentName,
            outputPath,
            example.compileOptions
          );

          markdown += exampleMarkdown;
        }
      }
    } else {
      markdown += `\`\`\`jsx\nimport { ${componentName} } from "@onedoc/react-print/server";\n\`\`\`\n\n`;
    }

    if (
      component &&
      component.props &&
      Object.keys(component.props).length > 0
    ) {
      markdown += `### API\n\n<ResponseField name="Props">\n<Expandable defaultOpen={true} title="Show available props">\n`;

      Object.entries(component.props).forEach(([propName, prop]) => {
        markdown += `<ResponseField name="${propName}" type="${safePropType(
          prop.type.name
        )}" required={${prop.required}}>\n\n${
          prop.description
        }\n\n${prop.defaultValue ? `Default: \`${JSON.stringify(prop.defaultValue.value)}\`\n\n` : ""}</ResponseField>\n`;
      });

      markdown += `</Expandable></ResponseField>\n`;
    }
  }

  return markdown;
};
