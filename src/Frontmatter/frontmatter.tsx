import React, { createContext, useContext } from "react";

interface Frontmatter {
  [key: string]: any;
}

export const formatters = {
  date:
    (language: string, options: Intl.DateTimeFormatOptions) => (date: string) =>
      new Intl.DateTimeFormat(language, options).format(new Date(date)),
  raw: () => (value: string) => value,
};

const FrontmatterContext = createContext<Frontmatter>({});

// List of formatters that return a callable to be executed on the frontmatter field contents

export const Frontmatter = ({
  field,
  placeholder = "",
  formatter = formatters.raw(),
  optional = false,
}: {
  field: string;
  placeholder?: string;
  formatter?: (value: string) => string;
  optional?: boolean;
}) => {
  const frontmatter = useContext(FrontmatterContext);

  const value =
    (frontmatter[field] !== undefined && formatter(frontmatter[field])) ||
    (optional ? "" : `<${placeholder || ""} [${field}]>`);
  return value;
};

export const FrontmatterProvider = ({
  frontmatter,
  children,
}: {
  frontmatter: Frontmatter;
  children: React.ReactNode;
}) => {
  return (
    <FrontmatterContext.Provider value={frontmatter || {}}>
      {children}
    </FrontmatterContext.Provider>
  );
};

const useFrontmatter = (field: string) => {
  const frontmatter = useContext(FrontmatterContext);

  return frontmatter[field] || undefined;
};
