import { DocConfig } from "docgen/types";
import React from "react";
import katex from "katex";

export const Latex = ({ children }: { children: string }) => {
  const html = katex.renderToString(children, {
    throwOnError: false,
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.css"
        integrity="sha384-OH8qNTHoMMVNVcKdKewlipV4SErXqccxxlg6HC9Cwjr5oZu2AdBej1TndeCirael"
        crossOrigin="anonymous"
      />
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};

export const __docConfig: DocConfig = {
  description: `Render LaTeX formulas right in your React components.

<Note>Rendering LaTeX using KaTeX requires pulling a remote stylesshet hosted by jsdelivr. This is done to prevent the styles from being purged.</Note>

<Tip>You can use \`String.raw\` to avoid escaping LaTeX backslashes.</Tip>`,
  components: {
    Latex: {
      examples: {
        default: {
          template: <Latex>{String.raw`\frac{1}{2}`}</Latex>,
        },
        complex: {
          template: (
            <Latex>{String.raw`% \f is defined as #1f(#2) using the macro
\f\relax{x} = \int_{-\infty}^\infty
    \f\hat\xi\,e^{2 \pi i \xi x}
    \,d\xi`}</Latex>
          ),
        },
      },
    },
  },
};
