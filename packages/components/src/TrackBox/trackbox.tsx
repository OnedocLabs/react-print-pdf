import React from "react";

export const TrackBox = ({
  children,
  tag,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  tag: string;
}) => (
  <div data-track-box={tag} {...props}>
    {children || null}
  </div>
);
