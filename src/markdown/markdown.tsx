import { DocConfig } from "docgen/types";
import { MarkdownToJSX, compiler } from "markdown-to-jsx";
import React, {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import { CSS, PageBreak, Tailwind } from "..";

interface TocRendererProps {
  heading: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  level: number;
  children: ReactNode;
  id: string;
}

interface MarkdownProps {
  children: string;
  tocRenderer?: (props: TocRendererProps) => ReactNode;
  options?: MarkdownToJSX.Options;
}

export const Markdown = (props: MarkdownProps) => {
  const content = compiler(props.children, props.options);

  let headers: TocRendererProps[] = [];

  const isReactElement = (child: ReactNode): child is ReactElement<any> => {
    return typeof child === "object" && child !== null && "type" in child;
  };

  const detectHeader = (child: ReactNode) => {
    if (!child) return;

    if (
      isReactElement(child) &&
      typeof child.type === "string" &&
      ["h1", "h2", "h3", "h4", "h5", "h6"].includes(child.type)
    ) {
      headers.push({
        heading: child.type,
        level: parseInt(child.type[1]),
        children: child.props.children,
        id: child.props.id,
      } as TocRendererProps);
    }

    if (isValidElement(child)) {
      if (
        typeof child.type === "function" &&
        child.type.prototype &&
        child.type.prototype.isReactComponent
      ) {
        // @ts-ignore
        const instance = new child.type(child.props); // Instantiate the class component
        const result = instance.render(); // Call its render method
        detectHeader(result);
      } else if (typeof child.type === "function") {
        // @ts-ignore
        const result = child.type(child.props); // call the component
        detectHeader(result);
      } else if (child.props && child.props.children) {
        Children.forEach(child.props.children, detectHeader);
      }
    }
  };

  const tocRenderer = props.tocRenderer;

  if (tocRenderer) detectHeader(content);

  const Toc = !!tocRenderer ? (
    <>{headers.map((header) => tocRenderer(header))}</>
  ) : null;

  return compiler(
    props.children,
    Object.assign({}, props.options, {
      overrides: {
        Toc: !!tocRenderer
          ? {
              component: () => Toc,
            }
          : undefined,
        ...props.options?.overrides,
      },
    })
  );
};

export const __docConfig: DocConfig = {
  description: `Render Markdown inside your templates. Provides a simple wrapper around [\`markdown-to-jsx\`](https://github.com/quantizor/markdown-to-jsx).

Markdown allows you to easily separate content from the layout, making it easier to maintain and update your templates. You can pull in content from a CMS or other sources, and use Markdown to format it.

You can also use custom components and variables to make your Markdown more dynamic. For example, you can replace Markdown components with your own components, or use variables to insert dynamic content.`,
  icon: "fa-brands fa-markdown",
  components: {
    Markdown: {
      server: true,
      client: true,
      examples: {
        default: {
          description:
            "Use a simple Markdown tag to support Markdown in your document.",
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
                    component: ({
                      children,
                    }: {
                      children: React.ReactNode;
                    }) => (
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
        tableOfContents: {
          name: "Table of Contents",
          description: `You can use the \`tocRenderer\` prop to render a table of contents from your Markdown content. The headers will be automatically detected and rendered in the order they appear. You need to place the \`<Toc />\` component in your Markdown content to render the table of contents.

You can also use the \`id\` attribute in your headers to link to them directly.`,
          template: (
            <Tailwind
              config={{
                corePlugins: {
                  preflight: false,
                },
              }}
            >
              <CSS>{`a.-toc-link:after {
                content: target-counter(attr(href), page);
                float: right;
              }`}</CSS>
              <Markdown
                options={{
                  overrides: {
                    PageBreak: {
                      component: PageBreak, // import { PageBreak } from "@fileforge/react-print";
                    },
                  },
                }}
                tocRenderer={({ level, children, id }) => (
                  <a
                    className="block py-2 border-b -toc-link"
                    style={{
                      paddingLeft: `${(level - 1) * 1}rem`,
                    }}
                    href={`#${id}`}
                  >
                    {children}
                  </a>
                )}
              >{`# Table of Contents

<Toc />

<PageBreak />

# This is a level 1 header

## This is a level 2 header

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.

## This is another level 2 header

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.

# This is a level 1 header, bis

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.`}</Markdown>
            </Tailwind>
          ),
        },
      },
    },
  },
};
