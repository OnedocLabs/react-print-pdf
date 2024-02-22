import React from "react";
import type { CompileOptions } from "../src/compile/compile";

export interface Example {
  description?: string;
  name?: string;
  template: React.ReactElement;
  compileOptions?: CompileOptions;
  imports?: string[];
  externalImports?: string[];
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
