/**
 * Much of this code is taken from the Resend react-email implementation of the Tailwind support.
 * Credits to the original author.
 */

import { DocConfig } from "docgen/types";
import React from "react";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import type { Config as TailwindConfig } from "tailwindcss";
// @ts-ignore
import postcssColorFunctionalNotation from "postcss-color-functional-notation";
// @ts-ignore
import postcssCssVariables from "postcss-css-variables";

import { quickSafeRenderToString } from "./utils.resend";

export const Tailwind = ({
  children,
  twConfig,
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
  twConfig?: Omit<TailwindConfig, "content">;
}) => {
  const markup = quickSafeRenderToString(children);

  const { css } = postcss([
    tailwindcss({
      ...twConfig,
      content: [{ raw: markup, extension: "html" }],
    }),
    // postcssCssVariables,
    postcssColorFunctionalNotation,
  ]).process(
    String.raw`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    {
      from: undefined,
    }
  );

  return (
    <>
      <style>{css}</style>
      {children}
    </>
  );
};

export const __docConfig: DocConfig = {
  name: "Tailwind",
  icon: "wind",
  description: `Allows for a simple, drop-in way to use Tailwind CSS in your components. This is useful for when you want to use Tailwind classes in your components, but don't want to set up a full Tailwind project. All children of this component will have access to the Tailwind CSS classes.`,
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
              twConfig={{
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
