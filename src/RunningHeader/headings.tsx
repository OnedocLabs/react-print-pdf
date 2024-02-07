import React from "react";
import "./headings.css";
import { DocConfig } from "../../docgen/types";
import { PageTop } from "../Shell/shell";

const RunningHeader = (level: number) => {
  return ({ before = "", after = "" }: { before?: string; after?: string }) => {
    return (
      <span
        className={`--docify-heading-contents --docify-h${level}-contents`}
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
  name: "Running header",
  icon: "heading",
  components: {
    RunningH1: {
      examples: {
        default: {
          description:
            "Show the current running header of level 1 in the page header.",
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
      examples: {},
    },
    RunningH3: {
      examples: {},
    },
    RunningH4: {
      examples: {},
    },
    RunningH5: {
      examples: {},
    },
    RunningH6: {
      examples: {},
    },
  },
};
