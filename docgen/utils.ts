import * as ts from "typescript";
import { DocConfig, ExtendedDocConfig } from "./types";
import * as esformatter from "esformatter";
import * as esformatterJsx from "esformatter-jsx";
import { renderToString } from "react-dom/server";
import juice from "juice";
import parse from "css-to-style";

export const formatCamelCaseToTitle = (str: string) => {
  // Convert camelCase to Title Case with spaces
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const listProperties = (node: ts.ObjectLiteralExpression) => {
  const properties = {};

  node.properties.forEach((property) => {
    if (ts.isPropertyAssignment(property)) {
      properties[property.name.getText()] = property.initializer;
    }
  });

  return properties;
};

const extractTemplates = (node) => {
  const templates = {};

  const components = listProperties(
    listProperties(node)["components"] as ts.ObjectLiteralExpression
  );

  Object.entries(components).forEach(([componentName, value]) => {
    templates[componentName] = {};

    const examples = listProperties(
      listProperties(value as ts.ObjectLiteralExpression)[
        "examples"
      ] as ts.ObjectLiteralExpression
    );

    Object.entries(examples).forEach(([exampleName, value]) => {
      const template = listProperties(value as ts.ObjectLiteralExpression)[
        "template"
      ];

      templates[componentName][exampleName] = template.getText();
    });
  });

  return templates;
};

export const getTemplateContents = (filePath: string) => {
  // Load the file contents to the typescript ast
  const sourceFile = ts.createSourceFile(
    filePath,
    ts.sys.readFile(filePath) || "",
    ts.ScriptTarget.Latest,
    true
  );

  let templates = {};

  sourceFile.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((declaration) => {
        if (declaration.name.getText() === "__docConfig") {
          templates = extractTemplates(declaration.initializer);
        }
      });
    }
  });

  return templates;
};

export const mergeTemplateInfo = (
  docInfo: DocConfig,
  templates: any
): ExtendedDocConfig => {
  Object.entries(docInfo.components).forEach(([componentName, value]) => {
    Object.entries(value.examples).forEach(([exampleName, example]) => {
      // @ts-ignore
      example.templateString = templates[componentName][exampleName];
    });
  });

  return docInfo as ExtendedDocConfig;
};

export const formatSnippet = (snippet: string) => {
  esformatter.register(esformatterJsx);
  return esformatter.format(snippet, {});
};

const reparseCss = (html: string) => {
  // Replace all style="" with style={{}} and parse the css.
  const styleRegex = /style="([^"]*)"/g;
  const matches = html.match(styleRegex);
  if (matches) {
    for (const match of matches) {
      const style = match.replace(/style="/, "").replace(/"/, "");
      const parsed = parse(style);
      const styleString = JSON.stringify(parsed);
      html = html.replace(match, `style={${styleString}}`);
    }
  }

  // Replace all class="" with className=""
  const classRegex = /class="([^"]*)"/g;
  const classMatches = html.match(classRegex);
  if (classMatches) {
    for (const match of classMatches) {
      html = html.replace(match, match.replace(/class="/, 'className="'));
    }
  }
  return html;
};

export const bundle = (reactComponent: React.ReactNode, style: string) => {
  if (!reactComponent) {
    return "";
  }

  const html = renderToString(reactComponent as React.ReactElement);

  const parsed = `<style>
        \{\`${style}\`\}
      </style>
      ${html}`;

  const sanitizedCss = juice(parsed);

  return sanitizedCss.trim();
};
