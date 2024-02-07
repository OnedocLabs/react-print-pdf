import { DocConfig, ExtendedDocConfig } from "./types";
import { ComponentDoc } from "react-docgen-typescript";
import { buildExample } from "./buildExample";

export const buildFileMarkdown = async (
  docConfig: ExtendedDocConfig,
  componentDocs: ComponentDoc[],
  style: string
) => {
  let markdown = `---
title: ${docConfig.name}
---\n\n`;

  for (const component of componentDocs) {
    const examples = docConfig.components[component.displayName].examples || {};

    markdown += `## ${component.displayName}\n\n`;

    if (component.description) {
      markdown += `${component.description}\n\n`;
    }

    if (examples.default) {
      const { markdown: exampleMarkdown } = await buildExample(
        examples.default,
        component.displayName,
        style
      );

      markdown += exampleMarkdown;
    }
  }

  return markdown;
};
