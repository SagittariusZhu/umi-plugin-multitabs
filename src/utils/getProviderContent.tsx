export default `
import React from "react";
import { plugin } from "../core/umiExports";
import childrenRender from "./layout/childrenRender";

interface Props {
  children: React.ReactNode;
}
export default (props: Props) => {
  const { children } = props;
  plugin.register({
    apply: {
      layout: {
        childrenRender,
      }
    },
    path: '/foo1.js',
  });
  return children;
};
`;