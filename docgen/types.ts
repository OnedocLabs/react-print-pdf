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

export interface ConfigComponentDoc<T = Example> {
  server: boolean;
  client: boolean;
  examples?: {
    [key: string]: T;
  };
}

export interface DocConfig<T = Example> {
  name?: string;
  icon?: string;
  description: string;
  components: {
    [componentName: string]: ConfigComponentDoc<T>;
  };
}

export type ExtendedDocConfig = DocConfig<EnrichedExample>;
