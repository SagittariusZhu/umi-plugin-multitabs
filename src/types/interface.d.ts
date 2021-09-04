import { IRoute } from 'umi';

interface Error {
  componentStack?: string;
  error?: string;
  [key: string]: any;
}

/**
 * 插件运行时配置
 */
export interface RuntimeLayoutConfig {
  childrenRender?: (dom: JSX.Element) => React.ReactNode,
  unAccessible?: JSX.Element,
  noFound?: JSX.Element,
}
