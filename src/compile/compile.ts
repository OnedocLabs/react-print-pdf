export const compile = async (node: React.ReactElement) => {
  const ReactDOMServer = await import("react-dom/server");
  return ReactDOMServer.renderToString(node);
};
