import React from "react";
import "./shell.css";

export const PageTop = (props: React.HTMLProps<HTMLDivElement> ) => {
  return (
    <div {...props} className={`--docify-page-top ${props?.className || ""}`} />
  );
};

export const CurrentPageTop = (props: React.HTMLProps<HTMLDivElement> ) => {
  return (
    <div
      {...props}
      className={`--docify-current-page-top ${props?.className || ""}`}
    />
  );
};

export const PageBottom = (props: React.HTMLProps<HTMLDivElement> ) => {
  return (
    <div
      {...props}
      className={`--docify-page-bottom ${props?.className || ""}`}
    />
  );
};

export const PageBreak = (props : React.HTMLProps<HTMLDivElement> ) => {
  return (
    <div
      {...props}
      className={`--docify-page-break ${props?.className || ""}`}
    />
  );
};

export const NoBreak = (props : React.HTMLProps<HTMLDivElement> ) => {
  return (
    <div {...props} className={`--docify-no-break ${props?.className || ""}`} />
  );
};

export const FloatBottom = (props :any ) => {
  return (
    <div
      {...props}
      style={{
        "-prince-float": "bottom",
      }}
    >
      {props.children}
    </div>
  );
};
