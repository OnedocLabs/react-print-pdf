/**
 * Much of this code is taken from the Resend react-email implementation of the Tailwind support.
 * Credits to the original author.
 */

import { DocConfig } from "docgen/types";
import React from "react";
import postcss, { Processor } from "postcss";
// import type { Config as TailwindConfig } from "tailwindcss";
// @ts-ignore
import postcssColorFunctionalNotation from "postcss-color-functional-notation";

import { quickSafeRenderToString } from "./utils.resend";
import type { CorePluginsConfig } from "tailwindcss/types/config";

import { CSS } from "../css/css";

// @ts-ignore
import preflightCss from "../../node_modules/tailwindcss/lib/css/preflight.css?raw";
import { createTailwindcssPlugin } from "@mhsdesign/jit-browser-tailwindcss";

export const Tailwind = ({
  children,
  config,
}: {
  /**
   * The children of the Tailwind component. Components will have access to the Tailwind CSS classes.
   */
  children: React.ReactNode;
  /**
   * A custom Tailwind config to use for this component.
   * See all available options at https://tailwindcss.com/docs/configuration
   *
   * NB: The `content` option is automatically set to the children of the Tailwind component.
   */
  config?: any; // Omit<TailwindConfig, "content">;
}) => {
  const markup = quickSafeRenderToString(children);

  const corePlugins = config?.corePlugins as CorePluginsConfig;

  const tailwindConfig = {
    ...config,
    corePlugins: {
      ...corePlugins,
      preflight: false,
    },
  };

  const { css } = postcss([
    createTailwindcssPlugin({
      tailwindConfig,
      content: [{ content: markup, extension: "html" }],
    }),
    // postcssCssVariables,
    postcssColorFunctionalNotation,
  ]).process(
    String.raw`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        ${preflightCss}
      `,
    {
      from: undefined,
    }
  );

  return (
    <>
      <CSS>{css}</CSS>
      {children}
    </>
  );
};

export const __docConfig: DocConfig = {
  name: "Tailwind",
  icon: "wind",
  description: `A simple, drop-in way to use Tailwind CSS in your components.

<Warning>
The supported Tailwind version is 3.3.2 due to changes in the PostCSS plugin synchronicity.
</Warning>`,
  components: {
    Tailwind: {
      client: true,
      server: true,
      examples: {
        default: {
          template: (
            <Tailwind>
              <div className="bg-gradient-to-tr from-blue-500 to-blue-700 rounded-2xl p-12"></div>
              <p className="py-12 text-slate-800">
                This is a Tailwind component. All children of this component
                will have access to the Tailwind CSS classes.
              </p>
            </Tailwind>
          ),
        },
        config: {
          name: "Custom Tailwind config",
          description:
            "You can also pass a custom Tailwind config to the Tailwind component.",
          template: (
            <Tailwind
              config={{
                theme: {
                  extend: {
                    colors: {
                      primary: "#6484cf",
                    },
                  },
                },
              }}
            >
              <div className="bg-primary p-12 rounded-2xl"></div>
              <p className="py-12 text-slate-800">
                This is a Tailwind component. All children of this component
                will have access to the Tailwind CSS classes.
              </p>
            </Tailwind>
          ),
        },
      },
    },
  },
};
