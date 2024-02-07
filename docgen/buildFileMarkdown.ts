import { ExtendedDocConfig } from "./types";
import { ComponentDoc } from "react-docgen-typescript";
import { buildExample } from "./buildExample";
import { formatCamelCaseToTitle } from "./utils";

export const buildFileMarkdown = async (
  docConfig: ExtendedDocConfig,
  componentDocs: ComponentDoc[],
  style: string
) => {
  let markdown = `---
title: ${docConfig.name}
${docConfig.icon ? `icon: ${docConfig.icon}` : ""}
---\n\n`;

  for (const component of componentDocs) {
    const examples = docConfig.components[component.displayName].examples || {};

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
          style
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
            style
          );

          markdown += exampleMarkdown;
        }
      }
    }

    if (component.props) {
      markdown += `### API\n\n<ResponseField name="Props">\n<Expandable defaultOpen={true} title="Show available props">\n`;

      Object.entries(component.props).forEach(([propName, prop]) => {
        markdown += `<ResponseField name="${propName}" type="${prop.type.name}" required={${prop.required}}>${prop.description}</ResponseField>\n`;
      });

      markdown += `</Expandable></ResponseField>\n`;
    }
  }

  return markdown;
};
