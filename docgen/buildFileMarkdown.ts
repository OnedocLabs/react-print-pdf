import { EnrichedExample, ExtendedDocConfig } from "./types";
import { ComponentDoc } from "react-docgen-typescript";
import { buildExample } from "./buildExample";
import { formatCamelCaseToTitle, safePropType } from "./utils";

export const buildFileMarkdown = async (
  docConfig: ExtendedDocConfig,
  componentDocs: ComponentDoc[],
  style: string,
  outputPath: string
) => {
  let markdown = `---
title: ${docConfig.name}
${docConfig.icon ? `icon: ${docConfig.icon}` : ""}
---\n\n${docConfig.description}\n\n`;

  for (const component of componentDocs) {
    let examples: {
      [key: string]: EnrichedExample;
    } = {};

    try {
      examples = docConfig.components[component.displayName].examples || {};
    } catch (e) {}

    markdown += `## ${component.displayName}\n\n`;

    if (component.description) {
      markdown += `${component.description}\n\n`;
    }

    if (Object.keys(examples).length > 0) {
      markdown += `### Examples\n\n`;

      if (examples.default) {
        markdown += `#### Preview\n\n`;

        const { markdown: exampleMarkdown } = await buildExample(
          examples.default,
          component.displayName,
          style,
          outputPath
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
            component.displayName,
            style,
            outputPath
          );

          markdown += exampleMarkdown;
        }
      }
    } else {
      markdown += `\`\`\`jsx\nimport { ${component.displayName} } from "@onedoc/react-print";\n\`\`\`\n\n`;
    }

    if (component.props && Object.keys(component.props).length > 0) {
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
