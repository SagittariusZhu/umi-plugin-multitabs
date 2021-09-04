import { IApi, utils } from 'umi';
import { join } from 'path';
import providerContent from './utils/getProviderContent';
import copySrcFiles from './utils/copySrcFiles';

const { winPath, getFile } = utils;

const DIR_NAME = 'plugin-multitabs';

export interface MenuDataItem {
  children?: MenuDataItem[];
  routes?: MenuDataItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  key?: string;
  path?: string;
  [key: string]: any;
}

export default (api: IApi) => {
  api.describe({
    key: 'multitabs',
    config: {
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });

  let generatedOnce = false;
  api.onGenerateFiles({
    fn() {
      if (generatedOnce) return;
      generatedOnce = true;
      const cwd = join(__dirname, '../src');
      const config = {};
      copySrcFiles({ cwd, absTmpPath: api.paths.absTmpPath!, config });
    },
    // 在其他文件生成之后，再执行
    stage: 99,
  });

  api.onGenerateFiles(async () => {
    api.writeTmpFile({
      path: winPath(join(DIR_NAME, 'Provider.tsx')),
      content: providerContent,
    });
  });

  api.addRuntimePluginKey(() => ['multitabs']);
  api.addRuntimePlugin(() => [`@@/${DIR_NAME}/runtime`]);
};
