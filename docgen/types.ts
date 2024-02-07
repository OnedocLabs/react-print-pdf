import React from "react";

export interface Example {
  description?: string;
  name?: string;
  template: React.ReactNode;
}

export interface EnrichedExample extends Example {
  templateString: string;
}

export interface DocConfig<T = Example> {
  name?: string;
  icon?: string;
  description: string;
  components: {
    [componentName: string]: {
      examples: {
        [key: string]: T;
      };
    };
  };
}

export type ExtendedDocConfig = DocConfig<EnrichedExample>;
