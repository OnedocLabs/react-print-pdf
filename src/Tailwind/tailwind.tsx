/**
 * Much of this code is taken from the Resend react-email implementation of the Tailwind support.
 * Credits to the original author.
 */

import { DocConfig } from "docgen/types";
import React from "react";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme.js";
import type { Config as TailwindConfig } from "tailwindcss";
// @ts-ignore
import postcssColorFunctionalNotation from "postcss-color-functional-notation";
import { merge } from "ts-deepmerge";

import { quickSafeRenderToString } from "./utils.resend";
import { CorePluginsConfig } from "tailwindcss/types/config";
import { readFileSync } from "fs";

import { CSS } from "../CSS/css";

const preflightCss = readFileSync(
  require.resolve("tailwindcss/lib/css/preflight.css")
);

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
  config?: Omit<TailwindConfig, "content">;
}) => {
  const markup = quickSafeRenderToString(children);

  const corePlugins = config?.corePlugins as CorePluginsConfig;

  // TODO: understand why this is necessary when using font-sans. Probably some misconfigured serif font in Prince.
  let fontSans = config?.theme?.fontFamily?.sans ?? [
    "arial",
    ...defaultTheme.fontFamily.sans,
  ];

  const tailwindConfig = {
    ...merge(config || {}, {
      theme: {
        fontFamily: {
          sans: fontSans,
        },
      },
    }),
    corePlugins: {
      preflight: false,
      ...corePlugins,
    },
  };

  const { css } = postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: markup, extension: "html" }],
    }),
    // postcssCssVariables,
    postcssColorFunctionalNotation,
  ]).process(
    String.raw`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        ${preflightCss.toString()}
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
  description: `A simple, drop-in way to use Tailwind CSS in your components.`,
  components: {
    Tailwind: {
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
