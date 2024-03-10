import React from "react";
import "./headings.css";
import "./variables.css";
import { DocConfig } from "../../docgen/types";
import { PageTop } from "../shell/shell";

/**
 * Returns the current page number.
 */
export const PageNumber = ({
  counterStyle = "decimal",
}: {
  /**
   * The style of the counter.
   */
  counterStyle?: string;
}) => {
  return (
    <span
      style={{
        content: `counter(page, ${counterStyle})`,
      }}
    />
  );
};

/**
 * Returns the total number of pages.
 */
export const PagesNumber = ({
  counterStyle = "decimal",
}: {
  /**
   * The style of the counter.
   */
  counterStyle?: string;
}) => {
  return (
    <span
      style={{
        content: `counter(pages, ${counterStyle})`,
      }}
    />
  );
};

const RunningHeader = (level: number) => {
  return ({ before = "", after = "" }: { before?: string; after?: string }) => {
    return (
      <span
        className={`--onedoc-heading-contents --onedoc-h${level}-contents`}
        data-before={before}
        data-after={after}
      />
    );
  };
};

/**
 * Returns the current page's running header of level 1.
 */
export const RunningH1 = RunningHeader(1);

/**
 * Returns the current page's running header of level 2.
 */
export const RunningH2 = RunningHeader(2);

/**
 * Returns the current page's running header of level 3.
 */
export const RunningH3 = RunningHeader(3);

/**
 * Returns the current page's running header of level 4.
 */
export const RunningH4 = RunningHeader(4);

/**
 * Returns the current page's running header of level 5.
 */
export const RunningH5 = RunningHeader(5);

/**
 * Returns the current page's running header of level 6.
 */
export const RunningH6 = RunningHeader(6);

export const __docConfig: DocConfig = {
  name: "Variables",
  icon: "subscript",
  description:
    "Display dynamic values based on your document, such as page numbers and running headers.",
  components: {
    PageNumber: {
      server: true,
      client: true,
      examples: {
        default: {
          template: <PageNumber counterStyle="decimal" />,
        },
        customStyle: {
          description:
            "You can use a custom CSS counter-style, by passing a known name or a custom counter style.",
          template: <PageNumber counterStyle="lower-roman" />,
        },
      },
    },
    PagesNumber: {
      server: true,
      client: true,
      examples: {
        default: {
          imports: ["PageNumber"],
          template: (
            <>
              <PageNumber counterStyle="decimal" />
              {" of "}
              <PagesNumber counterStyle="decimal" />
            </>
          ),
        },
      },
    },
    RunningH1: {
      server: true,
      client: true,
      examples: {
        default: {
          description:
            "Show the current running header of level 1 in the page header. All running headers are reset when any of their parent headings are encountered (e.g. a level 2 heading resets the level 3, 4, 5 and 6 headings).",
          template: (
            <React.Fragment>
              <PageTop style={{ paddingTop: "1rem" }}>
                <RunningH1 />
              </PageTop>
              <h1>Heading of level 1</h1>
            </React.Fragment>
          ),
        },
      },
    },
    RunningH2: {
      server: true,
      client: true,
    },
    RunningH3: {
      server: true,
      client: true,
    },
    RunningH4: {
      server: true,
      client: true,
    },
    RunningH5: {
      server: true,
      client: true,
    },
    RunningH6: {
      server: true,
      client: true,
    },
  },
};
