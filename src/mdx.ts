// This is used as a way to fix issues with interleaving in MDX templates.
export const useMDXComponents = () => {
  return {
    p: (props: any) => {
      return props.children;
    },
  };
};
