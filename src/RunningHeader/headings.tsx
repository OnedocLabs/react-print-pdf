import React from "react";
import "./headings.css";

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

export const RunningH1 = RunningHeader(1);

export const RunningH2 = RunningHeader(2);

export const RunningH3 = RunningHeader(3);

export const RunningH4 = RunningHeader(4);

export const RunningH5 = RunningHeader(5);

export const RunningH6 = RunningHeader(6);
