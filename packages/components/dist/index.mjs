// src/RunningHeader/headings.tsx
import React from "react";
var RunningHeader = (level) => {
  return ({ before = "", after = "" }) => {
    return /* @__PURE__ */ React.createElement(
      "span",
      {
        className: `--docify-heading-contents --docify-h${level}-contents`,
        "data-before": before,
        "data-after": after
      }
    );
  };
};
var RunningH1 = RunningHeader(1);
var RunningH2 = RunningHeader(2);
var RunningH3 = RunningHeader(3);
var RunningH4 = RunningHeader(4);
var RunningH5 = RunningHeader(5);
var RunningH6 = RunningHeader(6);

// src/Shell/shell.tsx
import React2 from "react";
var PageTop = (props) => {
  return /* @__PURE__ */ React2.createElement("div", { ...props, className: `--docify-page-top ${props?.className || ""}` });
};
var CurrentPageTop = (props) => {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      ...props,
      className: `--docify-current-page-top ${props?.className || ""}`
    }
  );
};
var PageBottom = (props) => {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      ...props,
      className: `--docify-page-bottom ${props?.className || ""}`
    }
  );
};
var PageBreak = (props) => {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      ...props,
      className: `--docify-page-break ${props?.className || ""}`
    }
  );
};
var NoBreak = (props) => {
  return /* @__PURE__ */ React2.createElement("div", { ...props, className: `--docify-no-break ${props?.className || ""}` });
};
var FloatBottom = (props) => {
  return /* @__PURE__ */ React2.createElement(
    "div",
    {
      ...props,
      style: {
        "-prince-float": "bottom"
      }
    },
    props.children
  );
};

// src/FileMetadata/variables.tsx
import React3 from "react";
var PageNumber = () => {
  return /* @__PURE__ */ React3.createElement("span", { className: "--docify-page-number-current" });
};
var TotalPages = () => {
  return /* @__PURE__ */ React3.createElement("span", { className: "--docify-page-number-total" });
};

// src/Frontmatter/frontmatter.tsx
import React4, { createContext as createContext2, useContext as useContext2 } from "react";
var formatters = {
  date: (language, options) => (date) => new Intl.DateTimeFormat(language, options).format(new Date(date)),
  raw: () => (value) => value
};
var FrontmatterContext = createContext2({});
var Frontmatter = ({
  field,
  placeholder = "",
  formatter = formatters.raw(),
  optional = false
}) => {
  const frontmatter = useContext2(FrontmatterContext);
  const value = frontmatter[field] !== void 0 && formatter(frontmatter[field]) || (optional ? "" : `<${placeholder || ""} [${field}]>`);
  return value;
};
var FrontmatterProvider = ({
  frontmatter,
  children
}) => {
  return /* @__PURE__ */ React4.createElement(FrontmatterContext.Provider, { value: frontmatter || {} }, children);
};
var useFrontmatter = (field) => {
  const frontmatter = useContext2(FrontmatterContext);
  return frontmatter[field] || void 0;
};

// src/Footnote/footnote.tsx
import React5 from "react";
var Footnote = ({
  children,
  ...props
}) => {
  return /* @__PURE__ */ React5.createElement(
    "span",
    {
      className: "--docify-footnote text-left text-xs font-normal",
      ...props
    },
    children
  );
};

// src/SIgnature/signature.tsx
import React7 from "react";

// src/TrackBox/trackbox.tsx
import React6 from "react";
var TrackBox = ({
  children,
  tag,
  ...props
}) => /* @__PURE__ */ React6.createElement("div", { "data-track-box": tag, ...props }, children || null);

// src/extensions/signatureconstants.ts
var SIGNATURE_PREFIX = "--docify-signature:";

// src/SIgnature/signature.tsx
var Signature = ({
  company,
  representative,
  tag
}) => {
  return /* @__PURE__ */ React7.createElement("div", { className: "border-b border-b-black h-48 whitespace-pre-wrap flex flex-col" }, company && /* @__PURE__ */ React7.createElement("div", { className: "text-xs text-gray-400 pb-1" }, company), representative && /* @__PURE__ */ React7.createElement("div", { className: "text-sm" }, representative), /* @__PURE__ */ React7.createElement("div", { className: "h-4" }), /* @__PURE__ */ React7.createElement(TrackBox, { tag: `${SIGNATURE_PREFIX}${tag}`, className: "flex-grow" }));
};
export {
  CurrentPageTop,
  FloatBottom,
  Footnote,
  Frontmatter,
  FrontmatterProvider,
  NoBreak,
  PageBottom,
  PageBreak,
  PageNumber,
  PageTop,
  RunningH1,
  RunningH2,
  RunningH3,
  RunningH4,
  RunningH5,
  RunningH6,
  Signature,
  TotalPages,
  TrackBox,
  formatters,
  useFrontmatter
};
//# sourceMappingURL=index.mjs.map