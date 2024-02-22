import { EnrichedExample, ExtendedDocConfig } from "./types";
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
---\n\n${docConfig.description}\n\n`;

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

    let examples: {
      [key: string]: EnrichedExample;
    } = {};

    try {
      examples = docConfig.components[componentName].examples || {};
    } catch (e) {}

    markdown += `## ${componentName}\n\n`;

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
      markdown += `\`\`\`jsx\nimport { ${componentName} } from "@onedoc/react-print";\n\`\`\`\n\n`;
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
