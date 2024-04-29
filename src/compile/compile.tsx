import { DocConfig } from "docgen/types";
import React from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";

// @ts-ignore
import onedocStyles from "../../dist/index.css?raw";

import { CSS } from "../css/css";

export interface CompileOptions {
  /**
   * Whether to use Emotion CSS.
   */
  emotion?: boolean;
}

export const compile = async (
  node: React.ReactElement,
  options?: CompileOptions
) => {
  const { emotion } = Object.assign(
    {
      emotion: false,
    },
    options || {}
  );

  const ReactDOMServer = await import("react-dom/server");

  let Element = (
    <>
      <CSS>{onedocStyles}</CSS>
      {node}
    </>
  );

  if (!emotion) {
    return ReactDOMServer.renderToString(Element);
  }

  const { CacheProvider } = await import("@emotion/react");
  const { default: createCache } = await import("@emotion/cache");
  const { default: createEmotionServer } = await import(
    "@emotion/server/create-instance"
  );

  const cache = createCache({ key: "css" });
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);

  Element = <CacheProvider value={cache}>{Element}</CacheProvider>;

  const html = ReactDOMServer.renderToString(Element);

  const chunks = extractCriticalToChunks(html);
  const styles = constructStyleTagsFromChunks(chunks);
  const mergedStylesheet = styles.replace(
    /<\/?style( data-emotion="[a-z0-9- ]+")?>/gm,
    ""
  );

  const { default: postcss } = await import("postcss");
  const { default: cssvariables } = await import("postcss-css-variables");
  // @ts-ignore
  const { default: logical } = await import("postcss-logical");

  const result = await postcss([cssvariables(), logical()]).process(
    mergedStylesheet,
    {
      from: undefined,
    }
  );

  return `<style>${result.css}</style>${html}`;
};

export const __docConfig: DocConfig = {
  name: "compile",
  icon: "code",
  description:
    "Compile a React component to a string with the Onedoc print styles.",
  components: {
    compile: {
      server: true,
      client: true,
      examples: {
        emotion: {
          description: `Pass \`{ emotion: true }\` as the second compile option to merge and extract critical CSS using Emotion. Some libraries such as Chakra UI require this option to work correctly.

\`\`\`jsx
const html = await compile(<Component />, { emotion: true });
\`\`\``,
          template: (
            <>
              <ChakraProvider>
                <Button colorScheme="blue">Hello</Button>
              </ChakraProvider>
            </>
          ),
          name: "Emotion CSS",
          compileOptions: {
            emotion: true,
          },
          externalImports: [
            `import { Button, ChakraProvider, extendTheme } from "@chakra-ui/react";`,
          ],
        },
      },
    },
  },
};
