import { DocConfig } from "docgen/types";
import MarkdownJSX from "markdown-to-jsx";
import React from "react";

export const Markdown = MarkdownJSX;

export const __docConfig: DocConfig = {
  description: `Render Markdown inside your templates. Provides a simple wrapper around [\`markdown-to-jsx\`](https://github.com/quantizor/markdown-to-jsx).

Markdown allows you to easily separate content from the layout, making it easier to maintain and update your templates. You can pull in content from a CMS or other sources, and use Markdown to format it.

You can also use custom components and variables to make your Markdown more dynamic. For example, you can replace Markdown components with your own components, or use variables to insert dynamic content.`,
  icon: "markdown",
  components: {
    Markdown: {
      server: true,
      client: true,
      examples: {
        default: {
          template: (
            <Markdown>{`# Hello, world!

> This is a blockquote

---

This is a paragraph with a [link](https://google.com)`}</Markdown>
          ),
        },
        customComponent: {
          name: "Custom Components and Variables",
          description:
            "You can leverage the `overrides` prop to replace Markdown components with your own components. This is useful for custom components or even for dynamic content.",
          template: (
            <Markdown
              options={{
                overrides: {
                  Title: {
                    component: () => "Non-Disclosure Agreement",
                  },
                  CustomerName: {
                    component: () => "John Doe",
                  },
                  KPI: {
                    component: ({ children }) => (
                      <div style={{ color: "blue", fontSize: "2rem" }}>
                        {children}
                      </div>
                    ),
                  },
                },
              }}
            >{`# <Title />

This agreement is signed with <CustomerName />.

<KPI>20/month</KPI>`}</Markdown>
          ),
        },
      },
    },
  },
};
