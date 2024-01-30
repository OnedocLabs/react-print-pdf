import React from "react";
import "./footnote.css";

/**
 * Creates an automatically numbered footnote.
 */
export const Footnote = ({
  children,
  ...props
}: {
  /**
   * The text to display in the footnote. This can be rich text.
   */
  children: React.ReactNode;
}) => {
  return (
    <span
      className="--docify-footnote text-left text-xs font-normal"
      {...props}
    >
      {children}
    </span>
  );
};
