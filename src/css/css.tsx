import { DocConfig } from "docgen/types";
import React from "react";
import { encode } from "html-entities";
import { Tailwind } from "..";
const allowedEntities = {
  "&apos;": "'",
  "&quot;": '"',
};

export const CSS = ({ children }: { children: string }) => {
  let contents = encode(children);

  // Replace allowed entities (nb: match all entities and replace them)
  for (const [entity, value] of Object.entries(allowedEntities)) {
    contents = contents.replace(new RegExp(entity, "g"), value);
  }

  return <style dangerouslySetInnerHTML={{ __html: contents }} />;
};

export const Font = ({ url }: { url: string }) => {
  return <CSS>{`@import url('${url}');`}</CSS>;
};

type MarginsProps = {
  pageRatio: string;
  top: string;
  right: string;
  left: string;
  bottom: string;
};
export const Margins = ({ pageRatio, top, right, left, bottom }: MarginsProps) => {

  return <CSS>{`@page {size: ${pageRatio};margin-top:${top}px;margin-right:${right}px;margin-left:${left}px;margin-bottom:${bottom}px;`}</CSS>;
};



export const __docConfig: DocConfig = {
  name: "CSS",
  icon: "fa-brands fa-css3-alt",
  description: `Allows adding CSS to the document while securely parsing and escaping it.

NB: While you can add regular CSS with the \`<style>\` tag, it's recommended to use the \`CSS\` component to ensure that the CSS is properly escaped, most notably when using URLs or other potentially unsafe content.`,
  components: {
    CSS: {
      server: true,
      client: true,
      examples: {
        default: {
          description: "Use a simple CSS print property to set the page size.",
          template: <CSS>{`@page { size: a4 landscape; }`}</CSS>,
        },
      },
    },
    Font:{
      server: true,
      client: true,
      examples: {
        default: {
          name: "Load a Google Font",
          description: "Load a Google Font using the `@import` rule.",
          template: (
            <React.Fragment>
              <Font url="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" />
              <p style={{ fontFamily: "Roboto, sans-serif" }}>
                This text uses the Roboto Light font.
              </p>
            </React.Fragment>
          ),
        },
      },

    },
    Margins:{
      server: true,
      client: true,
      examples: {
        default:{
          name: "Layout",
          description:
            "You can use the `@page` at-rule in CSS to manage all aspects of printed pages. More on this [here](https://developer.mozilla.org/en-US/docs/Web/CSS/@page).",
          template: (
            <React.Fragment>
              <CSS>{`body{background-color:lightblue}`}</CSS>
              <Margins pageRatio="A4" top="100" right="100" left="100" bottom="100"/>
              <div>Hello world!</div>
            </React.Fragment>
          ),
        },
      },

    }
  },
};
