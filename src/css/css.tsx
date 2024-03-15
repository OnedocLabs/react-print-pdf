import { DocConfig } from "docgen/types";
import React from "react";
import { encode } from "html-entities";
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

export const __docConfig: DocConfig = {
  name: "CSS",
  icon: "css3-alt",
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
        loadFont: {
          name: "Load a Google Font",
          description: "Load a Google Font using the `@import` rule.",
          template: (
            <React.Fragment>
              <CSS>
                {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');`}
              </CSS>
              <p style={{ fontFamily: "Roboto, sans-serif" }}>
                This text uses the Roboto Light font.
              </p>
            </React.Fragment>
          ),
        },
        layout: {
          name: "Layout",
          description:
            "You can use the `@page` at-rule in CSS to manage all aspects of printed pages. More on this [here](https://developer.mozilla.org/en-US/docs/Web/CSS/@page).",
          template: (
            <React.Fragment>
              <CSS>{`@page {size: A4;margin-top:1cm;margin-right:1cm;margin-left:1cm;margin-bottom:1cm;`}</CSS>
              <div>Hello world!</div>
            </React.Fragment>
          ),
        },
      },
    },
  },
};
