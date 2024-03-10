import React from "react";
import "./shell.css";
import { DocConfig } from "../../docgen/types";

/**
 * Displays content in the top of all the pages.
 *
 * This component should be placed as early as possible in the document and will apply to all subsequent pages.
 */
export const PageTop = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} className={`--onedoc-page-top ${props?.className || ""}`} />
  );
};

/**
 * Displays content in the top of the current page.
 *
 * This component will override the content of the `PageTop` component for the current page.
 */
export const CurrentPageTop = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`--onedoc-current-page-top ${props?.className || ""}`}
    />
  );
};

/**
 * Displays content in the bottom of all the pages.
 */
export const PageBottom = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`--onedoc-page-bottom ${props?.className || ""}`}
    />
  );
};

/**
 * Forces a page break.
 */
export const PageBreak = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={`--onedoc-page-break ${props?.className || ""}`}
    />
  );
};

/**
 * Prevents a page break. Wrap this component around content that should not be broken across pages.
 */
export const NoBreak = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} className={`--onedoc-no-break ${props?.className || ""}`} />
  );
};

/**
 * Floats the content to the bottom of the page.
 */
export const FloatBottom = (props: any) => {
  return (
    <div
      {...props}
      style={{
        PrinceFloat: "bottom",
      }}
    >
      {props.children}
    </div>
  );
};

export const __docConfig: DocConfig = {
  name: "Shell",
  icon: "border-all",
  description: "Display content in other page regions.",
  components: {
    PageTop: {
      server: true,
      client: true,
      examples: {
        default: {
          template: <PageTop style={{ backgroundColor: "#bfdbfe" }} />,
        },
      },
    },
    PageBottom: {
      server: true,
      client: true,
      examples: {
        default: {
          template: <PageBottom style={{ backgroundColor: "#bfdbfe" }} />,
        },
      },
    },
    FloatBottom: {
      server: true,
      client: true,
      examples: {
        default: {
          template: <FloatBottom>Here are some floated contents</FloatBottom>,
        },
      },
    },
  },
};
